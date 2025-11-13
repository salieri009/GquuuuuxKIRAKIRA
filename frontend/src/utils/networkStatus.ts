/**
 * 네트워크 상태 모니터링
 * Nielsen's Heuristics #1: Visibility of System Status
 */

import React from 'react';

export interface NetworkStatus {
  online: boolean;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

class NetworkMonitor {
  private listeners: Set<(status: NetworkStatus) => void> = new Set();
  private currentStatus: NetworkStatus = {
    online: navigator.onLine,
  };

  constructor() {
    this.updateStatus();
    this.setupListeners();
  }

  private setupListeners() {
    // 온라인/오프라인 이벤트
    window.addEventListener('online', () => {
      this.updateStatus();
      this.notifyListeners();
    });

    window.addEventListener('offline', () => {
      this.currentStatus.online = false;
      this.notifyListeners();
    });

    // Connection API (Chrome, Edge)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnection = () => {
        this.currentStatus = {
          online: navigator.onLine,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        };
        this.notifyListeners();
      };

      connection.addEventListener('change', updateConnection);
      updateConnection();
    }
  }

  private updateStatus() {
    this.currentStatus.online = navigator.onLine;

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.currentStatus = {
        ...this.currentStatus,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentStatus));
  }

  getStatus(): NetworkStatus {
    return { ...this.currentStatus };
  }

  subscribe(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentStatus); // 즉시 현재 상태 전달

    // 구독 해제 함수 반환
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// 싱글톤 인스턴스
export const networkMonitor = new NetworkMonitor();

/**
 * React Hook for network status
 */
export function useNetworkStatus() {
  const [status, setStatus] = React.useState<NetworkStatus>(
    networkMonitor.getStatus()
  );

  React.useEffect(() => {
    const unsubscribe = networkMonitor.subscribe(setStatus);
    return unsubscribe;
  }, []);

  return status;
}

