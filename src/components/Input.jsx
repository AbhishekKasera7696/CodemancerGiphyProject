import React, {useState,useEffect} from 'react';
import Giphy from './Giphy';






const Input = () => {

    const [data,setData] = useState([]);
    const [form, setForm] = React.useState({
        message : "",
    });
    const [active, setActive] = useState(false);

    useEffect(()=> {
        getData()
    }, [])

    

    const getData = () => {
        fetch (`http://localhost:3004/myData`)
            .then((res) => res.json())
            .then((res) => {
                // console.log(res)
                setData(res);
            })
            .catch((res) => console.log(res))
    };




    const handleClick = (e) => {
        e.preventDefault();
            // console.log(form);
    
            const payloadjson = JSON.stringify(form);
    
            fetch(`http://localhost:3004/myData`, {
                method: "POST",
                body: payloadjson,
                headers: {
                    "content-type" : "application/json"
                }
            }).then((res) => {
                // console.log(res)
                // console.log(res.data)
                getData();
            })
            .catch((err) => console.log(err))
      
    }

    const handleChange = event => {
        const {id, value} = event.target;
        setForm({
            ...form,
            [id]:value
        })
      };

      console.log(data)

    //  console.log('search',search)
    //  console.log('data',data)
     const {message} = form

  const showGiphy = () => {
       if(active === false){
        setActive(true)
       }
       else{
        setActive(false);
       }
     
  }

  console.log(active)
  

  return (
    <div style={{width:"100%", height:"500px",}}>
      
        <div style={{width:"100%",height:"800px",padding:"20px"}}>
            {data.map((item)=> {return(item.message.includes('https://') ? <img style={{width:"200px", height:"200px"}} src={item.message}/> : <p>{item.message}</p>)})}
              {active?<Giphy/>:""}
        </div>
        <div style={{padding:"20px"}}>
           <input className="p-2 flex-grow-1" id="message" type="text" placeholder='enter your post' onChange={handleChange} value={message}/>
          <button style={{margin:'10px'}} className="p-2 flex-grow-1 btn btn-success" onClick={handleClick}>Send Button</button>
          <button onClick={showGiphy} className="p-2 flex-grow-1 btn btn-primary">Gify Button</button>
        </div>
       
         
           
   
     
    </div>
  )
}

export default Input
