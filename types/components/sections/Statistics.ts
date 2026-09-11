//SECTION STATISTICS

export interface StatisticsData {
  stats: Array<{
    type?: "number" | "euros";
    value: number;
    plus: boolean;
    label: string;
    sublabel?: string;
  }>;
}

export interface StatisticsProps {
  data: StatisticsData;
  isDetailedEventPage?: boolean;
}
