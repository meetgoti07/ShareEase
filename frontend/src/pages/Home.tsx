import Layout from "@/layout/Layout.tsx";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";

export const Home = () => {
    const navigate = useNavigate();
    return (
        <Layout>
            <div className='flex w-full gap-3 p-3 sm:w-full'>
                <Card className='w-1/2 sm:w-full'>
                    <CardHeader>
                        <CardTitle>Buy Academic Good at Discount</CardTitle>
                        <CardDescription>Equip yourself for success without breaking the bank! Discover a wide range of high-quality textbooks, software, lab equipment, and study essentials—all available at discounted prices. Whether you're stocking up for the semester or need specialized tools for your coursework, our deals help you stay prepared and save money.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={()=> {
                            navigate('/shop')
                        }}>Shop Now</Button>
                    </CardFooter>
                </Card>
                <Card className='w-1/2 sm:w-full'>
                    <CardHeader>
                        <CardTitle>Find a Good Place to Live</CardTitle>
                        <CardDescription>Looking for affordable and comfortable housing? Connect with fellow students to rent flats and share the rent effortlessly. Browse verified listings, meet compatible roommates, and secure your ideal living space with ease. Make your university experience better by finding a great place to live with friends. Start your search today!</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={()=> {
                            navigate('/rent')
                        }}>Find a Flatmate</Button>
                    </CardFooter>
                </Card>
            </div>
            <hr/>
            <div className='w-2/3 p-3'>
                <div>
                    <h2 className='text-2xl'>FAQs</h2>
                </div>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                            Yes. It adheres to the WAI-ARIA design pattern.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Is it responsive?</AccordionTrigger>
                        <AccordionContent>
                            Yes. It is responsive and mobile-friendly.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Is it customizable?</AccordionTrigger>
                        <AccordionContent>
                            Yes. It is highly customizable.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </Layout>
    )
}