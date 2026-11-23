package controller

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/service"

	"github.com/gin-gonic/gin"
)

// pricingSourceCache mirrors the /api/pricing response of another new-api
// instance named by PRICING_SOURCE_URL, so the model square can show that
// catalog. It only affects what the page displays; billing on this site still
// uses the local ratios.
type pricingSourceCache struct {
	sync.Mutex
	body      []byte
	fetchedAt time.Time
}

const pricingSourceTTL = time.Minute

var pricingSource pricingSourceCache

// Get returns the cached body while it is fresh, refetches it otherwise, and
// keeps serving the last good body when the source is unreachable.
func (p *pricingSourceCache) Get(ctx context.Context, client *http.Client, sourceURL string) ([]byte, error) {
	p.Lock()
	defer p.Unlock()
	if p.body != nil && time.Since(p.fetchedAt) < pricingSourceTTL {
		return p.body, nil
	}

	body, err := fetchPricingSource(ctx, client, sourceURL)
	if err != nil {
		if p.body != nil {
			return p.body, nil
		}
		return nil, err
	}
	p.body = body
	p.fetchedAt = time.Now()
	return body, nil
}

func fetchPricingSource(ctx context.Context, client *http.Client, sourceURL string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, sourceURL, nil)
	if err != nil {
		return nil, err
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("pricing source returned status %d", resp.StatusCode)
	}
	body, err := io.ReadAll(io.LimitReader(resp.Body, 16<<20))
	if err != nil {
		return nil, err
	}
	var check struct {
		Success bool `json:"success"`
	}
	if err := common.Unmarshal(body, &check); err != nil {
		return nil, err
	}
	if !check.Success {
		return nil, fmt.Errorf("pricing source reported failure")
	}
	return body, nil
}

// ServePricingSource answers /api/pricing with the catalog of the instance
// named by PRICING_SOURCE_URL. It runs before GetPricing in the route chain and
// lets the request fall through to the local pricing when the variable is unset
// or the source cannot be read.
func ServePricingSource(c *gin.Context) {
	sourceURL := common.GetEnvOrDefaultString("PRICING_SOURCE_URL", "")
	if sourceURL == "" {
		return
	}
	body, err := pricingSource.Get(c.Request.Context(), service.GetHttpClient(), sourceURL)
	if err != nil {
		common.SysError(common.LogText("pricing source fetch failed, serving local pricing: %s", err.Error()))
		return
	}
	c.Data(http.StatusOK, "application/json; charset=utf-8", body)
	c.Abort()
}
