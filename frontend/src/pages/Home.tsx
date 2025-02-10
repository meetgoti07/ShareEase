import Layout from "@/layout/Layout.tsx";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import {MagicCard} from "@/components/ui/magic-card.tsx";

export const Home = () => {
    const navigate = useNavigate();
    return (
        <Layout>
            <div className='flex flex-col lg:flex-row w-full gap-3 p-3'>
                <MagicCard
                    className="cursor-pointer flex-col items-center justify-center text-4xl shadow-2xl p-1"
                    gradientColor={"#D9D9D955"}
                >
                    <Card className='w-full sm:w-full border-0 shadow-none bg-transparent'>
                        <CardHeader>
                            <CardTitle className={"text-2xl"}>Buy Academic Goods at Discount</CardTitle>
                            <CardDescription>
                                Equip yourself for success without breaking the bank! Discover a wide range of high-quality textbooks, software, lab equipment, and study essentials—all available at discounted prices. Whether you're stocking up for the semester or need specialized tools for your coursework, our deals help you stay prepared and save money.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button onClick={() => navigate('/shop')}>Shop Now</Button>
                        </CardFooter>
                    </Card>
                </MagicCard>
                <MagicCard
                    className="cursor-pointer flex-col items-center justify-center text-4xl shadow-2xl p-1"
                    gradientColor={"#D9D9D955"}
                >
                    <Card className='w-full sm:w-full border-0 shadow-none bg-transparent'>
                        <CardHeader>
                            <CardTitle className={"text-2xl"}>Find a Good Place to Live</CardTitle>
                            <CardDescription>
                                Looking for affordable and comfortable housing? Connect with fellow students to rent flats and share the rent effortlessly. Browse verified listings, meet compatible roommates, and secure your ideal living space with ease. Make your university experience better by finding a great place to live with friends. Start your search today!
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button onClick={() => navigate('/rent')}>Find a Flatmate</Button>
                        </CardFooter>
                    </Card>
                </MagicCard>

            </div>
            <hr />
            <div className='w-full max-w-screen-lg p-3'>
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