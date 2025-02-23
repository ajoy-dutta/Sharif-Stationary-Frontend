import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


import slide1 from '../../../../../assets/fresh-70.jpg';
import slide2 from '../../../../../assets/fresh-70.jpg';
import slide3 from '../../../../../assets/fresh-80.jpg';
import slide4 from '../../../../../assets/fresh-65.jpg';

const Category = () => {
    return (
        <section>
          <div className="text-center my-10 mt-8 mb-8">
    <p className="text-lg text-gray-500">From 10am to 10 pm</p>
    <h2 className="text-3xl font-bold">Order Online</h2>
</div>
            <Swiper
            slidesPerView={'4'}
            spaceBetween={1}
            pagination={{
                clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper mb-28"
        >
            <SwiperSlide>
                <img src={slide1} alt="" />
                {/* <h3 className='text-4xl text-center -mt-10 text-black'>SALADS</h3> */}
            </SwiperSlide>

            <SwiperSlide>
                <img src={slide2} alt="" />
                {/* <h3 className='text-4xl text-center -mt-10 text-white'>PIZZA </h3> */}

            </SwiperSlide>
            <SwiperSlide>
                <img src={slide3} alt="" />
                {/* <h3 className='text-4xl text-center -mt-10 text-black'>SOUPS</h3> */}

            </SwiperSlide>
            <SwiperSlide>
                <img src={slide4} alt="" />
                {/* <h3 className='text-4xl text-center -mt-10 text-black'>DESSERTS</h3> */}

            </SwiperSlide>
           

        </Swiper>
        </section>
    );
};

export default Category;