import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function WelcomeSection() {
  return (
    <Card className="bg-white border border-slate-200">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome To
            </h2>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Your Task Management Area
            </h3>
            <p className="text-slate-600 mb-6 max-w-md">
              Lorem ipsum dolor sit amet consectetur. Bibendum risus urna 
              tortor praesent.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              Learn More
            </Button>
          </div>
          
          {/* Illustration placeholder */}
          <div className="flex-shrink-0 ml-8">
            <div className="w-80 h-60 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center border border-blue-200">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-lg"></div>
                </div>
                <div className="text-blue-900 font-medium">Task Management</div>
                <div className="text-blue-700 text-sm">Illustration</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}