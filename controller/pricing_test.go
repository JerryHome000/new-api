package controller

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

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
