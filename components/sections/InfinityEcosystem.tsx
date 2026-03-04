import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNodeClick = (node: EcosystemNode) => {
    setSelectedNodeId(node.id);
    onNodeSelect?.(node);
  };

  // Calculate node positions around infinity loop
  // Using circle algorithm for even distribution
  const getNodePosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 180; // pixels
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div className={cn('w-full flex flex-col items-center gap-12', className)}>
      {/* Infinity Loop SVG Container */}
      <UnfoldReveal className="w-full">
        <div className="relative w-full aspect-square max-w-xl mx-auto">
          {/* SVG Infinity Loop */}
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full drop-shadow-sm"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Infinity loop path */}
            <motion.path
              d="M 200 300 Q 100 100 300 100 Q 500 100 500 300 Q 500 450 400 450 Q 300 450 200 300 Q 100 150 100 300 Q 100 400 200 450 Q 300 500 400 500 Q 550 500 550 300"
              stroke="#0B5147"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 2000 }}
              whileInView={{ strokeDashoffset: 0 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
              strokeDasharray="2000"
            />

            {/* Center label */}
            <g>
              <text
                x="300"
                y="310"
                textAnchor="middle"
                className="text-sm md:text-base font-bold fill-charcoal"
              >
                {centerLabel}
              </text>
            </g>

            {/* Node circles */}
            {nodes.map((node, index) => {
              const pos = getNodePosition(index, nodes.length);
              const isSelected = selectedNodeId === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${300 + pos.x}, ${300 + pos.y})`}
                >
                  <motion.circle
                    r="40"
                    fill={isSelected ? '#0B5147' : '#083D3A'}
                    stroke="#FDF6F1"
                    strokeWidth="3"
                    className="cursor-pointer hover:drop-shadow-md transition-all"
                    whileHover={{ scale: 1.1, fill: '#0B5147' }}
                    animate={{
                      scale: isSelected ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleNodeClick(node)}
                  />
                  <motion.text
                    y="5"
                    textAnchor="middle"
                    className="text-xs font-bold fill-cream pointer-events-none"
                    animate={{
                      opacity: isSelected ? 0 : 1,
                      fontSize: isSelected ? '10px' : '12px',
                    }}
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

      {/* Node Details Card */}
      <AnimatePresence>
        {selectedNodeId && (
          <motion.div
            layoutId="node-card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
            className="w-full max-w-2xl"
          >
            {nodes.map(
              (node) =>
                node.id === selectedNodeId && (
                  <div
                    key={node.id}
                    className="bg-white rounded-lg shadow-lg p-6 md:p-10 border-2 border-teal-dark"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
                          {node.title}
                        </h3>
                        {node.description && (
                          <p className="text-slate-medium text-sm md:text-base">
                            {node.description}
                          </p>
                        )}
                      </div>

                      {node.icon && (
                        <div className="text-4xl flex-shrink-0 ml-4">
                          {node.icon}
                        </div>
                      )}
                    </div>

                    <div className="prose prose-sm md:prose max-w-none text-charcoal mb-6">
                      {node.content}
                    </div>

                    <motion.button
                      onClick={() => setSelectedNodeId(null)}
                      className="text-teal-primary font-semibold hover:text-teal-dark transition-colors text-sm md:text-base"
                      whileHover={{ x: 4 }}
                    >
                      Close ✕
                    </motion.button>
                  </div>
                )
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
