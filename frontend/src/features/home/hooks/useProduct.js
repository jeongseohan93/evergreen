import { useEffect, useState } from "react";
import { lookProduct } from "../api/HomeProduct";

const HOME_KEYWORDS = ['popular', 'new', 'restock', 'recommend'];

const useProduct = () => {
    const [ products, setProducts ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect (() => {
        const loadProducts = async () => {
            try{
                const data = await lookProduct(HOME_KEYWORDS);
                const groupProducts = data.reduce((acc, product) => {
                    const keyword = product.keyword;
                    
                    if (!acc[keyword]) {
                        acc[keyword] = [];
                    }
                    acc[keyword].push(product);
                    return acc;
                }, {});
                setProducts(groupProducts);
            } catch (err){
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        
        loadProducts();
    }, []);
    return { products, loading, error };
}

export default useProduct;