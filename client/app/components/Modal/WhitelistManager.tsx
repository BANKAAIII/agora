"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusIcon, 
  TrashIcon, 
  UserGroupIcon,
  ExclamationTriangleIcon 
} from "@heroicons/react/24/outline";
import { 
  IdentifierType, 
  IDENTIFIER_TYPE_NAMES, 
  IDENTIFIER_TYPE_PLACEHOLDERS,
  validateIdentifier,
  formatIdentifierForDisplay,
  createWhitelistEntry,
  WhitelistEntry 
} from "@/app/helpers/userIdentification";

interface WhitelistManagerProps {
  whitelist: WhitelistEntry[];
  onChange: (whitelist: WhitelistEntry[]) => void;
  className?: string;
}

interface WhitelistItem {
  id: string;
  value: string;
  type: IdentifierType;
  error?: string;
}

const WhitelistManager: React.FC<WhitelistManagerProps> = ({
  whitelist,
  onChange,
  className = ""
}) => {
  const [items, setItems] = useState<WhitelistItem[]>([]);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState("");

  // Update parent when items change
  React.useEffect(() => {
    const validEntries = items
      .filter(item => !item.error && item.value.trim())
      .map(item => createWhitelistEntry(item.value, item.type));
    onChange(validEntries);
  }, [items, onChange]);

  const addItem = () => {
    const newItem: WhitelistItem = {
      id: Date.now().toString(),
      value: "",
      type: IdentifierType.EMAIL,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof WhitelistItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Validate if updating value or type
        if (field === 'value' || field === 'type') {
          const isValid = validateIdentifier(updated.value, updated.type);
          updated.error = updated.value.trim() && !isValid 
            ? `Invalid ${IDENTIFIER_TYPE_NAMES[updated.type].toLowerCase()} format`
            : undefined;
        }
        
        return updated;
      }
      return item;
    }));
  };

  const processBulkImport = () => {
    const lines = bulkText.split('\n').filter(line => line.trim());
    const newItems: WhitelistItem[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Auto-detect type based on format
      let type = IdentifierType.EMAIL;
      if (trimmed.includes('@') && !trimmed.includes('.')) {
        if (trimmed.includes('.farcaster')) {
          type = IdentifierType.FARCASTER;
        } else {
          type = IdentifierType.TWITTER;
        }
      } else if (trimmed.startsWith('0x')) {
        type = IdentifierType.WALLET;
      } else if (trimmed.includes('@') && trimmed.includes('.')) {
        type = IdentifierType.EMAIL;
      }
      
      const newItem: WhitelistItem = {
        id: `bulk-${Date.now()}-${index}`,
        value: trimmed,
        type,
      };
      
      // Validate
      const isValid = validateIdentifier(newItem.value, newItem.type);
      if (!isValid) {
        newItem.error = `Invalid ${IDENTIFIER_TYPE_NAMES[newItem.type].toLowerCase()} format`;
      }
      
      newItems.push(newItem);
    });
    
    setItems([...items, ...newItems]);
    setBulkText("");
    setShowBulkImport(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UserGroupIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Whitelist</h3>
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {items.filter(item => !item.error && item.value.trim()).length} valid entries
          </span>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            type="button"
            onClick={() => setShowBulkImport(!showBulkImport)}
            className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bulk Import
          </motion.button>
          
          <motion.button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Entry
          </motion.button>
        </div>
      </div>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {showBulkImport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Bulk Import Identifiers</h4>
              <p className="text-xs text-gray-600">
                Enter one identifier per line. Format will be auto-detected.
              </p>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`user1@example.com
@twitteruser
@farcasteruser.farcaster
@githubuser
0x1234567890123456789012345678901234567890`}
                rows={5}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBulkImport(false)}
                  className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={processBulkImport}
                  className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Import
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Whitelist Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserGroupIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm">No whitelist entries yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              Add identifiers to restrict election access to specific users.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-3 border rounded-lg ${
                  item.error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    {/* Identifier Type */}
                    <select
                      value={item.type}
                      onChange={(e) => updateItem(item.id, 'type', Number(e.target.value))}
                      className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {Object.entries(IDENTIFIER_TYPE_NAMES).map(([value, name]) => (
                        <option key={value} value={value}>{name}</option>
                      ))}
                    </select>
                    
                    {/* Identifier Value */}
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                        placeholder={IDENTIFIER_TYPE_PLACEHOLDERS[item.type]}
                        className={`block w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                          item.error ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <motion.button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </motion.button>
                </div>
                
                {/* Error Message */}
                {item.error && (
                  <div className="mt-2 flex items-center space-x-1 text-xs text-red-600">
                    <ExclamationTriangleIcon className="h-3 w-3" />
                    <span>{item.error}</span>
                  </div>
                )}
                
                {/* Preview */}
                {!item.error && item.value.trim() && (
                  <div className="mt-2 text-xs text-gray-500">
                    Preview: {formatIdentifierForDisplay(item.value, item.type)}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <UserGroupIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Private Election Access</h4>
            <div className="mt-1 text-xs text-blue-700">
              <p>Only users with whitelisted identifiers can view and vote in this election.</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li><strong>Email:</strong> For Google login users</li>
                <li><strong>Twitter:</strong> For Twitter login users (@username)</li>
                <li><strong>Farcaster:</strong> For Farcaster users (@username.farcaster)</li>
                <li><strong>GitHub:</strong> For GitHub login users (@username)</li>
                <li><strong>Wallet:</strong> For wallet address users (0x...)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhitelistManager;

