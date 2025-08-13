import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, CheckCircle, AlertCircle } from 'lucide-react';

const QualityTips = () => {
  const tips = [
    {
      icon: CheckCircle,
      title: "High Resolution",
      description: "Use 300+ DPI for optimal OCR accuracy",
      type: "success"
    },
    {
      icon: CheckCircle,
      title: "Even Lighting",
      description: "Avoid shadows and glare on text",
      type: "success"
    },
    {
      icon: CheckCircle,
      title: "Straight Alignment",
      description: "Keep text horizontal and properly framed",
      type: "success"
    },
    {
      icon: AlertCircle,
      title: "Clear Handwriting",
      description: "Legible text improves AI processing",
      type: "warning"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Quality Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div key={index} className="flex items-start space-x-3">
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                tip.type === 'success' ? 'text-green-500' : 'text-orange-500'
              }`} />
              <div>
                <p className="text-sm font-medium">{tip.title}</p>
                <p className="text-xs text-gray-500">{tip.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QualityTips;
