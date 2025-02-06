import { Helmet } from "react-helmet-async";

import Banner from "../Banner/Banner";
import Featured from "../Featured/Featured";
import Category from "./Category/Category";


const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Sharif Stationary</title>
            </Helmet>
           <Banner></Banner>
           <Category></Category>
          
           <Featured></Featured>
          
        </div>
    );
};

export default Home;