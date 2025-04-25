"use client";

import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NetworkType, NETWORK_DETAILS } from "@/constants/networks";
import { useNetworkSelection } from "@/hooks/useNetworkSelection";

interface NetworkSelectorProps {
  className?: string;
}

export function NetworkSelector({ className }: NetworkSelectorProps) {
  const { selectedNetwork, handleNetworkChange, networkDetails } =
    useNetworkSelection();

  // If network details are not available, show loading state
  if (!networkDetails) {
    return (
      <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedNetwork}
        onValueChange={(value) => handleNetworkChange(value as NetworkType)}
      >
        <SelectTrigger
          className={`h-8 border-none bg-transparent ${className}`}
        >
          <SelectValue>
            <span className="text-sm text-muted-foreground">
              {networkDetails.displayName}
              {networkDetails.isTestnet && " (Testnet)"}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(NETWORK_DETAILS).map(([key, details]) => (
            <SelectItem key={key} value={key} disabled={!details.isEnabled}>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{details.displayName}</span>
                {details.isTestnet && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (Testnet)
                  </span>
                )}
                {!details.isEnabled && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (Coming Soon)
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
