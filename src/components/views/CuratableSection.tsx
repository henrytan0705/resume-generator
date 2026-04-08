import React from 'react';
import { Trash2, RotateCcw, ToggleLeft, ToggleRight, LucideIcon } from 'lucide-react';

export interface CuratableSectionProps<T> {
  title: string;
  items: T[];
  icon: LucideIcon;
  // Section-wide opt-out
  optOutSection?: boolean;
  onToggleSection?: () => void;
  // Item-level soft deletes
  optedOutIds: Set<string>;
  onToggleItem: (id: string, store: Set<string>) => void;
  
  // Render Mappings
  getId: (item: T) => string | undefined;
  renderTitle: (item: T) => React.ReactNode;
  renderSubtitle?: (item: T) => React.ReactNode;
  renderDetails?: (item: T) => React.ReactNode;
  
  emptyMessage?: string;
  showRecordCount?: boolean;
  isFirst?: boolean; // to determine top border and rounding
  isLast?: boolean; // to determine bottom border radius
}

export function CuratableSection<T>({
  title,
  items,
  icon: Icon,
  optOutSection = false,
  onToggleSection,
  optedOutIds,
  onToggleItem,
  getId,
  renderTitle,
  renderSubtitle,
  renderDetails,
  emptyMessage = "No records found.",
  showRecordCount = false,
  isFirst = false,
  isLast = false
}: CuratableSectionProps<T>) {
  
  // Conditionally applies structural transitions if the whole layer is opted out
  const sectionOpacity = optOutSection ? 'grayscale opacity-75' : '';
  const itemOpacity = optOutSection ? 'pointer-events-none opacity-50' : '';

  const borderClasses = `border-x border-b ${isFirst ? 'border-t rounded-t-2xl' : ''}`;

  return (
    <div className={`bg-slate-50 p-6 sm:p-8 ${borderClasses} border-slate-200 transition-all duration-500 ${sectionOpacity} ${isLast ? 'rounded-b-2xl' : ''}`}>
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${optOutSection ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
          <Icon className={`w-5 h-5 ${optOutSection ? 'text-slate-400' : 'text-slate-500'}`} />
          {title}
        </h3>
        
        {items.length > 0 && onToggleSection ? (
          <button 
            onClick={onToggleSection} 
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-full text-xs font-semibold transition-colors"
          >
            {optOutSection ? (
              <><ToggleLeft className="w-4 h-4 text-slate-500" /> Opted Out</>
            ) : (
              <><ToggleRight className="w-4 h-4 text-emerald-600" /> Opt Out</>
            )}
          </button>
        ) : (
          showRecordCount && items.length > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 bg-slate-200 text-slate-600 rounded-full">
              {items.length} records
            </span>
          )
        )}
      </div>

      {/* List Mapping Container */}
      <div className={`space-y-3 ${itemOpacity}`}>
        {items.map((item, idx) => {
          const id = getId(item);
          const isOptedOut = id ? optedOutIds.has(id) : false;
          
          return (
            <div 
              key={id || `item-${idx}`} 
              className={`group flex items-center justify-between border p-4 rounded-xl transition-all duration-300 ${
                isOptedOut 
                  ? 'bg-slate-100 border-transparent opacity-60 grayscale' 
                  : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm'
              }`}
            >
              <div className={isOptedOut ? 'opacity-60 line-through' : ''}>
                <h4 className="font-semibold text-slate-800 text-sm">{renderTitle(item)}</h4>
                {renderSubtitle && renderSubtitle(item)}
                {renderDetails && renderDetails(item)}
              </div>
              
              <button 
                type="button"
                onClick={() => id && onToggleItem(id, optedOutIds)}
                aria-label={isOptedOut ? `Restore ${title} entry` : `Remove ${title} entry`}
                className={`p-2 rounded-lg transition-colors ms-4 flex-shrink-0 ${
                  isOptedOut ? 'text-blue-500 bg-blue-50 hover:bg-blue-100' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                {isOptedOut ? <RotateCcw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-sm italic text-slate-500">{emptyMessage}</p>
        )}
      </div>
      
    </div>
  );
}
