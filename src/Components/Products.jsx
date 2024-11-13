import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Tables from "./Tables";
import db from "../firebase";
import { query, collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const Products = () => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleSave = async (id) => {
    if (!id) return;

    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, { description });
      dispatch({ type: 'UPDATE_product', payload: { id, description } });
      
      console.log('dsescription Changed!')
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          qty: data.qty,
          boughtBy: data.boughtBy,
          price: data.price,
          link: data.link,
          description: data.description,
          category: data.category
        };
      });
      dispatch({ type: 'LOAD_products', payload: products });
    });

    return () => unsubscribe();
  }, [dispatch]);

  const products = useSelector(state => state.products.products);
  const categories = useSelector(state => state.categories.categories);

  return (
    <div>
      {products.map((product) => {
        const otherCategories = categories
          .filter((category) => category.name !== product.category)
          .map((category) => category.name);

        return (
          <div key={product.id} className="products-container">
            <div className="left-section">
              <div className="form-control-mini">
                <strong>Title:</strong>
                <input className="form-control-mini" type="text" defaultValue={product.name} />
                <br /><br />

                <strong>Category:</strong>
                <select defaultValue={product.category}>
                  <option value={product.category}>{product.category}</option>
                  {otherCategories.map((categoryName, index) => (
                    <option key={index} value={categoryName}>{categoryName}</option>
                  ))}
                </select>
                <br /><br />

                <strong>Description:</strong>
                <br />
                <textarea
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setSelectedProductId(product.id);
                  }}
                  className="form-control-mini"
                  defaultValue={product.description}
                />
                <br /><br />

                <button onClick={() => handleSave(product.id)} className="btn btn-save">Save</button>
                <br /><br />
              </div>
            </div>
            <div className="right-section">
              <div className="box">
                <div className="price-link-container">
                  <div>
                    <strong>Price: </strong>
                    <input type="text" defaultValue={product.price} className="input-wide" />
                  </div>
                  <div>
                    <strong>Link: </strong>
                    <input type="text" defaultValue={product.link} className="input-wide" />
                  </div>
                  <div>
                    <strong>Bought By: </strong>
                    <Tables
                      data={product.boughtBy}
                      columns={[
                        { key: 'name', label: 'Name' },
                        { key: 'qty', label: 'Qty' },
                        { key: 'date', label: 'Date' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Products;
