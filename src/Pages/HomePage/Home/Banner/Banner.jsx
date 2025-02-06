import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

import img1 from '../../../../assets/fresh-65.jpg';
import img2 from '../../../../assets/fresh-80.jpg';
import img3 from '../../../../assets/6.jpg';
import img4 from '../../../../assets/fresh-80.jpg';

const Banner = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
            <Carousel showThumbs={false} autoPlay infiniteLoop>
                <div className="w-full h-screen flex items-center justify-center">
                    <img className="max-w-full max-h-full object-contain" src={img1} alt="Slide 1" />
                </div>
                <div className="w-full h-screen flex items-center justify-center">
                    <img className="max-w-full max-h-full object-contain" src={img2} alt="Slide 2" />
                </div>
                <div className="w-full h-screen flex items-center justify-center">
                    <img className="max-w-full max-h-full object-contain" src={img3} alt="Slide 3" />
                </div>
                <div className="w-full h-screen flex items-center justify-center">
                    <img className="max-w-full max-h-full object-contain" src={img4} alt="Slide 4" />
                </div>
            </Carousel>
        </div>
    );
};

export default Banner;
