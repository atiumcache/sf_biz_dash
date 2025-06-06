import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TotalCountWidgetProps {
    count: number
}

const currentDate: string = new Date().toDateString();

const TotalCountCard = ({ count }: TotalCountWidgetProps ) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <h2>{count}</h2>
                <h3>active businesses</h3>
            </CardContent>
            <CardFooter>
                <p>as of {currentDate}</p>
            </CardFooter>
        </Card>
    )
}

export default TotalCountCard