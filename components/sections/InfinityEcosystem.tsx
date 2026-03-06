import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import UnfoldReveal from '@/components/animations/UnfoldReveal';

interface EcosystemNode {
  id: string;
  label: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface InfinityEcosystemProps {
  nodes: EcosystemNode[];
  centerLabel?: string;
  className?: string;
  onNodeSelect?: (node: EcosystemNode) => void;
}

/**
 * InfinityEcosystem Component
 * Interactive diagram with nodes that expand into detailed cards
 * Core signature interaction of the TSC Website 2.0
 */
export const InfinityEcosystem: React.FC<InfinityEcosystemProps> = ({
  nodes,
  centerLabel = 'Artist at the centre',
  className,
  onNodeSelect,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'center center'], // Animation ends when element is centered on page
  });

  // Transform scroll progress to stroke-dashoffset (0 to 2000, then inverts color)
  // Animation completes when element reaches center of viewport
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [2000, 0]);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Monitor animation completion - trigger at 100% (after one complete rotation/drawing)
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      setIsAnimationComplete(value >= 1.0); // Set to true when 100% scrolled (after one complete rotation)
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const handleNodeClick = (node: EcosystemNode) => {
    setSelectedNodeId(node.id);
    onNodeSelect?.(node);
  };

  // Calculate node positions around infinity loop
  // Using circle algorithm for even distribution
  const getNodePosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 450; // pixels (increased 3x for larger buttons)
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div ref={containerRef} className={cn('w-full flex flex-col lg:flex-row items-stretch gap-6 sm:gap-8 md:gap-10 lg:gap-16', className)}>
      {/* Left: Infinity Loop SVG Container - Sticky on desktop */}
      <div className="w-full lg:w-1/2 lg:sticky lg:top-24 h-fit">
        <UnfoldReveal className="w-full">
          <div className="relative w-full mx-auto lg:mx-0 px-4 sm:px-0" style={{ aspectRatio: '1/1', maxWidth: 'clamp(300px, 90vw, 720px)' }}>
            {/* SVG Infinity Loop - Responsive sizing */}
            <svg
              viewBox="0 0 1800 1800"
              className="w-full h-full drop-shadow-sm"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Perfect Circle - Orange initially, Teal when complete */}
              <motion.circle
                cx="900"
                cy="900"
                r="450"
                stroke={isAnimationComplete ? '#0B5147' : '#D4622D'}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2827}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: isAnimationComplete ? 'stroke 0.8s ease-in-out' : 'none',
                }}
              />

              {/* Center label - Orange text before complete, Teal after */}
              <g>
                <text
                  x="900"
                  y="920"
                  textAnchor="middle"
                  className={cn('font-bold transition-colors', 
                    isAnimationComplete ? 'fill-teal-dark' : 'fill-pumpkin'
                  )}
                  style={{ fontSize: '54px', fontWeight: 'bold' }}
                >
                  {centerLabel}
                </text>
              </g>

              {/* Node circles - Orange initially, then Teal when complete */}
              {nodes.map((node, index) => {
                const pos = getNodePosition(index, nodes.length);
                const isSelected = selectedNodeId === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${900 + pos.x}, ${900 + pos.y})`}
                  >
                    <motion.circle
                      r="135"
                      fill={isSelected ? (isAnimationComplete ? '#126D5E' : '#E07548') : (isAnimationComplete ? '#0B5147' : '#D4622D')}
                      stroke={isAnimationComplete ? '#0B5147' : '#FDF6F1'}
                      strokeWidth="9"
                      className="cursor-pointer hover:drop-shadow-md transition-all"
                      style={{
                        transition: isAnimationComplete ? 'fill 0.8s ease-in-out, stroke 0.8s ease-in-out' : 'none',
                      }}
                      whileHover={{ scale: 1.1 }}
                      animate={{
                        scale: isSelected ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleNodeClick(node)}
                    />
                    <motion.text
                      y="15"
                      textAnchor="middle"
                      className={cn('font-bold pointer-events-none',
                        isSelected
                          ? isAnimationComplete ? 'fill-charcoal' : 'fill-charcoal'
                          : isAnimationComplete ? 'fill-cream' : 'fill-cream'
                      )}
                      style={{ fontSize: '39px', fontWeight: isSelected ? '900' : 'bold' }}
                      transition={{ duration: 0.3 }}
                    >
                      {node.label}
                    </motion.text>
                  </g>
                );
              })}
            </svg>

            {/* Mobile Node Label */}
            {isMobile && selectedNodeId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 text-center"
              >
                <p className="text-sm font-semibold text-charcoal">
                  {nodes.find((n) => n.id === selectedNodeId)?.label}
                </p>
              </motion.div>
            )}
          </div>
        </UnfoldReveal>
      </div>

      {/* Right: Node Details Card - Centered vertically */}
      <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center">
        <AnimatePresence>
          {selectedNodeId ? (
            <motion.div
              layoutId="node-card"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
              className="w-full px-3 sm:px-4 md:px-6 lg:px-8"
            >
              {nodes.map(
                (node) =>
                  node.id === selectedNodeId && (
                    <div
                      key={node.id}
                      className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-10 border-2 border-teal-dark w-full"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                        <div className="w-full">
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-charcoal mb-2">
                            {node.title}
                          </h3>
                          {node.description && (
                            <p className="text-slate-medium text-xs sm:text-sm md:text-base">
                              {node.description}
                            </p>
                          )}
                        </div>

                        {node.icon && (
                          <div className="text-3xl sm:text-4xl flex-shrink-0">
                            {node.icon}
                          </div>
                        )}
                      </div>

                      <div className="prose prose-sm md:prose max-w-none text-charcoal mb-4 sm:mb-6 text-xs sm:text-sm">
                        {node.content}
                      </div>

                      <motion.button
                        onClick={() => setSelectedNodeId(null)}
                        className="text-teal-primary font-semibold hover:text-teal-dark transition-colors text-xs sm:text-sm md:text-base"
                        whileHover={{ x: 4 }}
                      >
                        Close ✕
                      </motion.button>
                    </div>
                  )
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full text-center lg:text-left py-12 lg:py-0"
            >
              <p className="text-slate-medium text-lg font-alan-sans">
                Select a node to explore the ecosystem
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Sheet Alternative */}
      {isMobile && selectedNodeId && (
        <AnimatePresence>
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed inset-0 z-50 lg:hidden"
            style={{ top: 'auto' }}
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNodeId(null)}
              className="absolute inset-0 bg-black/20"
            />

            {/* Sheet */}
            <motion.div className="relative bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-charcoal">
                  {nodes.find((n) => n.id === selectedNodeId)?.title}
                </h3>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="text-2xl text-charcoal hover:text-slate-medium"
                >
                  ✕
                </button>
              </div>

              {nodes.find((n) => n.id === selectedNodeId)?.content}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default InfinityEcosystem;
