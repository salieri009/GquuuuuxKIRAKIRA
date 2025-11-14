import React, { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Clock, X, Filter } from 'lucide-react';
import { useEffectStore } from '../../store/effectStore';
import { useUIStore } from '../../store/uiStore';
import GlassPanel from '../ui/GlassPanel';
import LoadingSpinner from '../ui/LoadingSpinner';
import NeonButton from '../ui/NeonButton';

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
  
  const { showToast } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const recentEffects = getRecentEffects();
  const favoriteEffects = getFavoriteEffects();

  // 필터링된 효과 목록
  const filteredEffects = useMemo(() => {
    let result = effects;

    // 즐겨찾기 필터
    if (showFavorites) {
      result = favoriteEffects;
    } else if (showRecent) {
      result = recentEffects;
    }

    // 카테고리 필터
    if (filterCategory) {
      result = result.filter(effect => effect.category === filterCategory);
    }

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(effect => {
        const searchText = [
          effect.name,
          effect.description,
          ...effect.relatedGundam,
          effect.category,
        ].join(' ').toLowerCase();
        return searchText.includes(query);
      });
    }

    return result;
  }, [effects, searchQuery, filterCategory, showFavorites, showRecent, favoriteEffects, recentEffects]);

  const categories = useMemo(() => {
    const cats = new Set(effects.map(e => e.category));
    return Array.from(cats);
  }, [effects]);

  const handleEffectSelect = (effectId: string) => {
    selectEffect(effectId);
    showToast(`${effects.find(e => e.id === effectId)?.name} 효과를 선택했습니다.`, 'success');
  };

  const handleToggleFavorite = (effectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(effectId);
    const effect = effects.find(e => e.id === effectId);
    if (effect) {
      showToast(
        isFavorite(effectId) 
          ? `${effect.name}을(를) 즐겨찾기에서 제거했습니다.`
          : `${effect.name}을(를) 즐겨찾기에 추가했습니다.`,
        'info'
      );
    }
  };

  if (status === 'loading') {
    return (
      <GlassPanel className="p-lg text-center">
        <LoadingSpinner />
        <p className="mt-md text-muted">효과 목록을 불러오는 중...</p>
      </GlassPanel>
    );
  }

  if (status === 'failed') {
    return (
      <GlassPanel className="p-lg text-center">
        <p className="text-danger mb-md">효과 목록을 불러올 수 없습니다</p>
        <p className="text-muted text-sm mb-md">{error}</p>
        <NeonButton onClick={() => window.location.reload()}>
          페이지 새로고침
        </NeonButton>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-lg h-full flex flex-col">
      <div className="mb-lg">
        <h3 className="text-lg font-bold text-accent mb-md">효과 라이브러리</h3>
        
        {/* 검색 바 */}
        <div className="relative mb-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="효과 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-sm bg-secondary-bg border-2 border-primary-accent rounded text-text-primary placeholder-text-muted focus:outline-none focus:border-secondary-accent"
            aria-label="효과 검색"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
              aria-label="검색어 지우기"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 필터 버튼 */}
        <div className="flex flex-wrap gap-xs mb-sm">
          <NeonButton
            size="sm"
            variant={showFavorites ? 'primary' : 'ghost'}
            onClick={() => {
              setShowFavorites(!showFavorites);
              setShowRecent(false);
            }}
            leftIcon={<Star size={14} />}
          >
            즐겨찾기 ({favoriteEffects.length})
          </NeonButton>
          
          <NeonButton
            size="sm"
            variant={showRecent ? 'primary' : 'ghost'}
            onClick={() => {
              setShowRecent(!showRecent);
              setShowFavorites(false);
            }}
            leftIcon={<Clock size={14} />}
          >
            최근 사용 ({recentEffects.length})
          </NeonButton>
        </div>

        {/* 카테고리 필터 */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-xs mb-sm">
            <NeonButton
              size="sm"
              variant={!filterCategory ? 'primary' : 'ghost'}
              onClick={() => setFilterCategory(null)}
            >
              전체
            </NeonButton>
            {categories.map(category => (
              <NeonButton
                key={category}
                size="sm"
                variant={filterCategory === category ? 'primary' : 'ghost'}
                onClick={() => setFilterCategory(category)}
              >
                {category === 'particles' ? '입자' :
                 category === 'energy' ? '에너지' :
                 category === 'weapons' ? '무기' :
                 category === 'environment' ? '환경' : category}
              </NeonButton>
            ))}
          </div>
        )}
      </div>

      {/* 효과 목록 */}
      <div className="flex-1 overflow-y-auto space-y-md">
        {filteredEffects.length === 0 ? (
          <div className="text-center py-lg">
            <p className="text-text-muted">
              {searchQuery ? '검색 결과가 없습니다.' : 
               showFavorites ? '즐겨찾기한 효과가 없습니다.' :
               showRecent ? '최근 사용한 효과가 없습니다.' :
               '효과가 없습니다.'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredEffects.map((effect, index) => (
              <motion.div
                key={effect.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`effect-card cursor-pointer p-md rounded-lg border-2 transition-all ${
                  selectedEffect?.id === effect.id
                    ? 'border-primary-accent bg-primary-accent bg-opacity-10'
                    : 'border-border-primary hover:border-primary-accent hover:bg-primary-accent hover:bg-opacity-5'
                }`}
                onClick={() => handleEffectSelect(effect.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEffectSelect(effect.id);
                  }
                }}
                aria-label={`${effect.name} 효과 선택`}
              >
                <div className="flex items-start gap-md">
                  <div className="relative flex-shrink-0">
                    <img
                      src={effect.thumbnail || '/images/placeholder.jpg'}
                      alt={effect.name}
                      className="w-16 h-12 object-cover rounded border border-primary-accent"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                    {selectedEffect?.id === effect.id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-accent rounded-full border-2 border-primary-bg" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-sm">
                      <h4 className="font-bold text-text-primary truncate">
                        {effect.name}
                      </h4>
                      <button
                        onClick={(e) => handleToggleFavorite(effect.id, e)}
                        className={`flex-shrink-0 p-xs rounded transition-colors ${
                          isFavorite(effect.id)
                            ? 'text-warning hover:text-warning'
                            : 'text-text-muted hover:text-warning'
                        }`}
                        aria-label={isFavorite(effect.id) ? '즐겨찾기 제거' : '즐겨찾기 추가'}
                        title={isFavorite(effect.id) ? '즐겨찾기 제거' : '즐겨찾기 추가'}
                      >
                        <Star 
                          size={16} 
                          fill={isFavorite(effect.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                    
                    <p className="text-sm text-text-secondary line-clamp-2 mt-xs">
                      {effect.description}
                    </p>
                    
                    <div className="mt-sm">
                      <div className="flex flex-wrap gap-xs">
                        {effect.relatedGundam.slice(0, 2).map((gundam) => (
                          <span
                            key={gundam}
                            className="px-2 py-1 text-xs bg-secondary-accent bg-opacity-20 text-secondary-accent rounded border border-secondary-accent border-opacity-30"
                          >
                            {gundam}
                          </span>
                        ))}
                        {effect.relatedGundam.length > 2 && (
                          <span className="px-2 py-1 text-xs text-text-muted border border-border-primary rounded">
                            +{effect.relatedGundam.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 결과 카운트 */}
      {filteredEffects.length > 0 && (
        <div className="mt-md pt-md border-t border-border-primary text-xs text-text-muted text-center">
          {filteredEffects.length}개의 효과 표시 중
        </div>
      )}
    </GlassPanel>
  );
}
