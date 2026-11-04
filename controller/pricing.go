package controller

import (
	"context"
	"fmt"
	"io"
	"maps"
	"net/http"
	"sync"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/service"
	"github.com/QuantumNous/new-api/setting/ratio_setting"

	"github.com/gin-gonic/gin"
)

func filterPricingByUsableGroups(pricing []model.Pricing, usableGroup map[string]string) []model.Pricing {
	if len(pricing) == 0 {
		return pricing
	}
	if len(usableGroup) == 0 {
		return []model.Pricing{}
	}

	filtered := make([]model.Pricing, 0, len(pricing))
	for _, item := range pricing {
		if common.StringsContains(item.EnableGroup, "all") {
			filtered = append(filtered, item)
			continue
		}
		for _, group := range item.EnableGroup {
			if _, ok := usableGroup[group]; ok {
				filtered = append(filtered, item)
				break
			}
		}
	}
	return filtered
}

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

func GetPricing(c *gin.Context) {
	if sourceURL := common.GetEnvOrDefaultString("PRICING_SOURCE_URL", ""); sourceURL != "" {
		body, err := pricingSource.Get(c.Request.Context(), service.GetHttpClient(), sourceURL)
		if err == nil {
			c.Data(http.StatusOK, "application/json; charset=utf-8", body)
			return
		}
		common.SysError(common.LogText("pricing source fetch failed, serving local pricing: %s", err.Error()))
	}

	pricing := model.GetPricing()
	userId, exists := c.Get("id")
	usableGroup := map[string]string{}
	groupRatio := map[string]float64{}
	maps.Copy(groupRatio, ratio_setting.GetGroupRatioCopy())
	var group string
	if exists {
		user, err := model.GetUserCache(userId.(int))
		if err == nil {
			group = user.Group
			for g := range groupRatio {
				ratio, ok := ratio_setting.GetGroupGroupRatio(group, g)
				if ok {
					groupRatio[g] = ratio
				}
			}
		}
	}

	usableGroup = service.GetUserUsableGroups(group)
	pricing = filterPricingByUsableGroups(pricing, usableGroup)
	// check groupRatio contains usableGroup
	for group := range ratio_setting.GetGroupRatioCopy() {
		if _, ok := usableGroup[group]; !ok {
			delete(groupRatio, group)
		}
	}

	c.JSON(200, gin.H{
		"success":            true,
		"data":               pricing,
		"vendors":            model.GetVendors(),
		"group_ratio":        groupRatio,
		"usable_group":       usableGroup,
		"supported_endpoint": model.GetSupportedEndpointMap(),
		"auto_groups":        service.GetUserAutoGroup(group),
		"pricing_version":    "a42d372ccf0b5dd13ecf71203521f9d2",
	})
}

func ResetModelRatio(c *gin.Context) {
	defaultStr := ratio_setting.DefaultModelRatio2JSONString()
	err := model.UpdateOption("ModelRatio", defaultStr)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	err = ratio_setting.UpdateModelRatioByJSONString(defaultStr)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccessT(c, "Model ratios reset", nil)
}
