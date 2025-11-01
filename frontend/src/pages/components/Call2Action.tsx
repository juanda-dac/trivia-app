import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface Props {
    onStart?: () => void;
}

export default function Call2Action({ onStart }: Props){
    return (
        <Card className="p-2 w-full max-w-md">
            <CardHeader>
                <h1 className="text-center font-bold text-xl">¡La ciencia y el conocimiento se unen para formar mentes brillantes!</h1>
                <hr />
            </CardHeader>
            <CardContent>
                <div className="flex justify-center">
                    <Button variant="outline" onClick={onStart}>Comenzar</Button>
                </div>
            </CardContent>
        </Card>
    )
}
