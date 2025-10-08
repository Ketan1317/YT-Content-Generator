import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export default function SmartScoreBadge({ score }: { score: number }) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute z-10 right-2 top-2 px-2 py-1 rounded-md bg-blue-500 text-white text-sm font-semibold cursor-pointer shadow-md hover:bg-blue-600 transition">
            {score}X
          </div>
        </TooltipTrigger>

        <TooltipContent side="left" align="center" className="text-sm">
          <p>Outlier & SmartScore</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
