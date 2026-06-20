import React, { useState, useMemo } from "react";
import { Search, Star, Clock, X } from "lucide-react";
import { useEffectStore } from "../../store/effectStore";
import GlassPanel from "../ui/GlassPanel";
import LoadingSpinner from "../ui/LoadingSpinner";
import Button from "../ui/Button";

export default function EffectLibrary() {
  const {
    effects,
    selectedEffect,
    status,
    error,
    selectEffect,
    toggleFavorite,
    isFavorite,
    getRecentEffects,
    getFavoriteEffects,
  } = useEffectStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const recentEffects = getRecentEffects();
  const favoriteEffects = getFavoriteEffects();

  const filteredEffects = useMemo(() => {
    let result = effects;

    if (showFavorites) {
      result = favoriteEffects;
    } else if (showRecent) {
      result = recentEffects;
    }

    if (filterCategory) {
      result = result.filter((effect) => effect.category === filterCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((effect) => {
        const searchText = [
          effect.name,
          effect.description,
          ...effect.relatedGundam,
          effect.category,
        ]
          .join(" ")
          .toLowerCase();
        return searchText.includes(query);
      });
    }

    return result;
  }, [
    effects,
    searchQuery,
    filterCategory,
    showFavorites,
    showRecent,
    favoriteEffects,
    recentEffects,
  ]);

  const categories = useMemo(() => {
    const cats = new Set(
      effects.map((e) => e.category).filter((c): c is string => Boolean(c)),
    );
    return Array.from(cats);
  }, [effects]);

  const categoryLabel = (category: string) => {
    if (category === "particles") return "입자";
    if (category === "energy") return "에너지";
    if (category === "weapons") return "무기";
    if (category === "environment") return "환경";
    return category;
  };

  if (status === "loading") {
    return (
      <GlassPanel className="p-6 text-center h-full">
        <LoadingSpinner />
        <p className="mt-4 text-muted">효과 목록을 불러오는 중...</p>
      </GlassPanel>
    );
  }

  if (status === "failed") {
    return (
      <GlassPanel className="p-6 text-center h-full">
        <p className="text-danger mb-4">효과 목록을 불러올 수 없습니다</p>
        <p className="text-muted text-sm mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} size="sm">
          새로고침
        </Button>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          효과 라이브러리
        </h3>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm bg-secondary-bg border border-border-primary rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary-accent focus:border-primary-accent"
            aria-label="효과 검색"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              aria-label="검색어 지우기"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Button
            size="sm"
            variant={showFavorites ? "primary" : "ghost"}
            onClick={() => {
              setShowFavorites(!showFavorites);
              setShowRecent(false);
            }}
            leftIcon={<Star size={14} />}
          >
            즐겨찾기 {favoriteEffects.length}
          </Button>
          <Button
            size="sm"
            variant={showRecent ? "primary" : "ghost"}
            onClick={() => {
              setShowRecent(!showRecent);
              setShowFavorites(false);
            }}
            leftIcon={<Clock size={14} />}
          >
            최근 {recentEffects.length}
          </Button>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={!filterCategory ? "secondary" : "ghost"}
              onClick={() => setFilterCategory(null)}
            >
              전체
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={filterCategory === category ? "secondary" : "ghost"}
                onClick={() => setFilterCategory(category)}
              >
                {categoryLabel(category)}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredEffects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-muted text-sm">
              {searchQuery
                ? "검색 결과가 없습니다."
                : showFavorites
                  ? "즐겨찾기한 효과가 없습니다."
                  : showRecent
                    ? "최근 사용한 효과가 없습니다."
                    : "효과가 없습니다."}
            </p>
          </div>
        ) : (
          filteredEffects.map((effect) => {
            const isSelected = selectedEffect?.id === effect.id;
            return (
              <div
                key={effect.id}
                className={`effect-card p-3 rounded-lg ${isSelected ? "active" : ""}`}
                data-selected={isSelected}
                onClick={() => selectEffect(effect.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectEffect(effect.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${effect.name} 효과 선택`}
                aria-current={isSelected ? "true" : undefined}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={effect.thumbnail || "/images/placeholder.jpg"}
                    alt=""
                    className="w-14 h-10 object-cover rounded border border-border-primary shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/placeholder.jpg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-text-primary truncate">
                        {effect.name}
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(effect.id);
                        }}
                        className={`shrink-0 p-1 rounded text-text-muted hover:text-warning transition-colors ${
                          isFavorite(effect.id) ? "text-warning" : ""
                        }`}
                        aria-label={
                          isFavorite(effect.id)
                            ? "즐겨찾기 제거"
                            : "즐겨찾기 추가"
                        }
                      >
                        <Star
                          size={14}
                          fill={isFavorite(effect.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-2 mt-1">
                      {effect.description}
                    </p>
                    {effect.relatedGundam.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {effect.relatedGundam.slice(0, 2).map((gundam) => (
                          <span
                            key={gundam}
                            className="px-1.5 py-0.5 text-[10px] rounded bg-surface text-text-muted"
                          >
                            {gundam}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredEffects.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border-primary text-xs text-text-muted text-center">
          {filteredEffects.length}개 표시
        </div>
      )}
    </GlassPanel>
  );
}
