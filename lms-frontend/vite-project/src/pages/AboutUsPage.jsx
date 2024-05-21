import aboutMainImage from "../assets/images/aboutMainImage.png"
import apj from "../assets/images/apj.png"
import billGates from "../assets/images/billGates.png"
import einstein from "../assets/images/einstein.png"
import nelsonMandela from "../assets/images/nelsonMandela.png"
import steveJobs from "../assets/images/steveJobs.png"
import CarouselSlide from "../components/CarouselSlide"

const AboutUsPage=()=>{
    const celebrities=[
        {
            title:"Apj Abdul Kalam" ,
            discription:"Failure will never overtake me if my determination to succeed is strong enough." ,
            image:apj ,
            slideNumber:1
        },
        {
            title:"Bill Gates" ,
            discription:"Success is a lousy teacher. It seduces smart people into thinking they can’t lose." ,
            image:billGates ,
            slideNumber:2
        },
        {
            title:"Albert Einsteain" ,
            discription:"There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle." ,
            image:einstein ,
            slideNumber:3
        },
        {
            title:"Nelson Mandela" ,
            discription:"Education is the most powerful weapon which you can use to change the world." ,
            image:nelsonMandela ,
            slideNumber:4
        },
        {
            title:"Steve Jobs" ,
            discription:"It's really hard to design products by focus groups. A lot of times, people don't know what they want until you show it to them." ,
            image:steveJobs ,
            slideNumber:5
        },
        
    ]
        
    
    return(
        <div className="ml-32 mt-24 flex flex-col gap-5">
            <div className="flex flex-row">
            <section className="w-1/2 space-y-10">
                <h1 className="text-5xl font-semibold text-yellow-500">Affordable and quality education</h1>
                <p className="text-xl text-gray-200">Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                    Natus neque voluptatibus consectetur, omnis illum harum? 
                    Itaque quibusdam veritatis consectetur, aliquid quae accusantium 
                    temporibus inventore amet quam minus enim facilis rem nesciunt 
                    repudiandae harum totam rerum consequatur molestias ad eveniet, delectus eligendi 
                    soluta omnis. Quaerat dignissimos mollitia architecto repellat ea iure!</p>
            </section>
            <div>
                <img src={aboutMainImage} alt="aboutMainImage"  className="drop-shadow-2xl" />
            </div>
            </div>

            <div className="carousel w-1/2 my-16 m-auto">
                {celebrities && celebrities.map((ele,idx) =>
                <CarouselSlide key={idx} 
                title={ele.title} 
                discription={ele.discription} 
                image={ele.image} 
                slideNumber={ele.slideNumber} 
                totalSlide={celebrities.length} />)}
                </div>  
            
        </div>
    )
}
export default AboutUsPage