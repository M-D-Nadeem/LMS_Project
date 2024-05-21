const CarouselSlide=({totalSlide,image,title,discription,slideNumber})=>{
    return(
        <div id={"slide"+slideNumber} className="carousel-item relative w-full">
               <div className="flex flex-col items-center justify-center gap-5">
               <img src={image} className="w-40 h-40 rounded-full flex items-center justify-center" />
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                <p className="text-xl font-semibold text-center">{discription}</p>
                 </div>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 ">
                <a href={"#slide"+((slideNumber==1)? totalSlide : (slideNumber-1))} className="btn btn-circle">❮</a> 
                <a href={"#slide"+((slideNumber==totalSlide)? 1 : (slideNumber+1))} className="btn btn-circle">❯</a>
                </div>
                </div> 
    )
}
export default CarouselSlide