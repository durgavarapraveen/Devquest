import React, { useEffect } from 'react'
import axios from 'axios'
import Navbar from '../Components/Navbar/Navbar';

function API() {

    useEffect(() => {
        const fetchData = async () => {
            const options = {
                method: 'GET',
                url: 'https://dvishal485.github.io/flipkart-scraper-api/sample-product.json',
                // params: {
                //   api_key: '72ed41e2042350173706fe2e2015bb40'
                // },
                // headers: {
                //   'X-RapidAPI-Key': '76f7d96dd1msh448e66c2f804e10p143cc9jsn2074821d5b55',
                //   'X-RapidAPI-Host': 'jdsan-amazon-scrapper.p.rapidapi.com'
                // }
              };
              
              try {
                  const response = await axios.request(options);
                  console.log(response.data);
              } catch (error) {
                  console.error(error);
              }
        };

        fetchData()
    }, []);

    return (
        <div>
            <Navbar />
            {/* <a target="_blank" href="https://www.amazon.in/gp/search?ie=UTF8&tag=1234560f590-21&linkCode=ur2&linkId=da1e208a1665fab6151114781ff91f3a&camp=3638&creative=24630&index=aps&keywords=All">Fun</a> */}
        </div>
    )
}

export default API