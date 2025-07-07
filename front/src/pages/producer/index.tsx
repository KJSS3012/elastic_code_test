import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

const Producers = () => {
  const producers = useSelector((state: RootState) => state.producer.producers);
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Produtores</h1>
        <Button onClick={() => navigate("/producers/new")}>+ Novo Produtor</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {producers.length === 0 ? (
          <p className="text-muted-foreground">Nenhum produtor cadastrado.</p>
        ) : (
          producers.map((producer) => (
            <Card key={producer.id} className="cursor-pointer hover:shadow" onClick={() => navigate(`/producers/${producer.id}/edit`)}>
              <CardContent className="p-4 space-y-1">
                <p className="font-semibold">{producer.name}</p>
                <p className="text-sm text-muted-foreground">{producer.document}</p>
                <p className="text-sm text-muted-foreground">
                  Fazendas: {producer.farms.length}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Producers;
