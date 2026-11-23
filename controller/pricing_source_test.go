package controller

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/QuantumNous/new-api/service"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPricingSourceCacheServesFreshThenStaleBody(t *testing.T) {
	hits := 0
	healthy := true
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hits++
		if !healthy {
			w.WriteHeader(http.StatusBadGateway)
			return
		}
		_, _ = w.Write([]byte(`{"success":true,"data":[{"model_name":"remote-model"}]}`))
	}))
	defer server.Close()

	var cache pricingSourceCache
	ctx := context.Background()

	body, err := cache.Get(ctx, server.Client(), server.URL)
	require.NoError(t, err)
	assert.Contains(t, string(body), "remote-model")

	_, err = cache.Get(ctx, server.Client(), server.URL)
	require.NoError(t, err)
	assert.Equal(t, 1, hits, "a fresh cache must not refetch")

	healthy = false
	cache.fetchedAt = time.Now().Add(-2 * pricingSourceTTL)
	body, err = cache.Get(ctx, server.Client(), server.URL)
	require.NoError(t, err)
	assert.Equal(t, 2, hits)
	assert.Contains(t, string(body), "remote-model", "an unreachable source keeps the last good body")
}

func TestPricingSourceCacheRejectsUnsuccessfulBody(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(`{"success":false,"message":"disabled"}`))
	}))
	defer server.Close()

	var cache pricingSourceCache
	_, err := cache.Get(context.Background(), server.Client(), server.URL)
	require.Error(t, err)
}

func TestServePricingSourceFallsThroughToLocalPricing(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service.InitHttpClient()
	const remoteBody = `{"success":true,"data":[{"model_name":"remote-model"}]}`
	healthy := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(remoteBody))
	}))
	defer healthy.Close()
	down := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadGateway)
	}))
	defer down.Close()

	router := gin.New()
	router.GET("/api/pricing", ServePricingSource, func(c *gin.Context) {
		c.String(http.StatusOK, "local")
	})

	cases := []struct {
		name      string
		sourceURL string
		want      string
	}{
		{name: "unset source serves local pricing", sourceURL: "", want: "local"},
		{name: "reachable source replaces local pricing", sourceURL: healthy.URL, want: remoteBody},
		{name: "unreachable source without a cached body serves local pricing", sourceURL: down.URL, want: "local"},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Setenv("PRICING_SOURCE_URL", tc.sourceURL)
			pricingSource.Lock()
			pricingSource.body = nil
			pricingSource.Unlock()

			recorder := httptest.NewRecorder()
			router.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/api/pricing", nil))

			require.Equal(t, http.StatusOK, recorder.Code)
			assert.Equal(t, tc.want, recorder.Body.String())
		})
	}
}
