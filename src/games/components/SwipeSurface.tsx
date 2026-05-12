import { useMemo, useRef } from 'react';
import { PanResponder, View, type ViewProps } from 'react-native';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export type SwipeSurfaceProps = {
  children: React.ReactNode;
  onSwipe: (dir: SwipeDirection) => void;
  enabled?: boolean;
  /** Minimum displacement on the dominant axis to count as a swipe (default 32). */
  threshold?: number;
  style?: ViewProps['style'];
};

const DEFAULT_THRESHOLD = 32;

export function SwipeSurface({
  children,
  onSwipe,
  enabled = true,
  threshold = DEFAULT_THRESHOLD,
  style,
}: SwipeSurfaceProps) {
  const startRef = useRef({ x: 0, y: 0 });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => enabled,
        onMoveShouldSetPanResponder: (_, g) =>
          enabled && (Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6),
        onPanResponderGrant: (e) => {
          startRef.current = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
          };
        },
        onPanResponderRelease: (e) => {
          if (!enabled) return;
          const dx = e.nativeEvent.pageX - startRef.current.x;
          const dy = e.nativeEvent.pageY - startRef.current.y;
          const ax = Math.abs(dx);
          const ay = Math.abs(dy);
          if (ax < threshold && ay < threshold) return;
          if (ax >= ay) {
            if (dx > threshold) onSwipe('right');
            else if (dx < -threshold) onSwipe('left');
          } else {
            if (dy > threshold) onSwipe('down');
            else if (dy < -threshold) onSwipe('up');
          }
        },
      }),
    [enabled, onSwipe, threshold],
  );

  return (
    <View collapsable={false} style={style} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}
