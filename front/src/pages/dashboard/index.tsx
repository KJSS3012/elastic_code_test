import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Dashboard = () => {
  const producers = useSelector((state: RootState) => state.producer.producers);

  const totalFarms = producers.reduce((sum, p) => sum + p.farms.length, 0);
  const totalHectares = producers.reduce(
    (sum, p) =>
      sum +
      p.farms.reduce((fSum, f) => fSum + f.totalArea, 0),
    0
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total de Fazendas</p>
            <p className="text-xl font-semibold">{totalFarms}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total de Hectares</p>
            <p className="text-xl font-semibold">{totalHectares} ha</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Produtores Cadastrados</p>
            <p className="text-xl font-semibold">{producers.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;