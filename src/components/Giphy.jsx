import React, { useEffect, useState } from "react";
import axios from "axios";

import Loader from "./Loader";
import Paginate from "./Paginate";
// import { render } from "react-dom";

const Giphy = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const [form, setForm] = React.useState({
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const results = await axios("https://api.giphy.com/v1/gifs/trending", {
          params: {
            api_key: "1Z21ZgRnBV0EHO9ZLEtGy0IyVIoP1A0y",
            limit: 100,
          },
        });

        console.log(results);
        setData(results.data.data);
      } catch (err) {
        setIsError(true);
        setTimeout(() => setIsError(false), 4000);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);



  const imageSave = (e) => {
    // e.preventDefault();
    // console.log(form);

    const payloadjson = JSON.stringify(form);

    fetch(`http://localhost:3004/myData`, {
      method: "POST",
      body: payloadjson,
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        // console.log(res)
        // console.log(res.data)
        // getData();
      })
      .catch((err) => console.log(err));
      
  };
  console.log(form)

  const renderGifs = () => {
    if (isLoading) {
      return <Loader />;
    }
    return currentItems.map((el) => {
      return (
        <div key={el.id} className="gif">
          <img alt="home1"
            onClick={() =>
              {setForm({ ...form, message: el.images.fixed_height.url }); imageSave()}
            }
            src={el.images.fixed_height.url}
          />
        </div>
      );
    });
  };

  const renderError = () => {
    if (isError) {
      return (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          Unable to get Gifs, please try again in a few minutes
        </div>
      );
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsError(false);
    setIsLoading(true);

    try {
      const results = await axios("https://api.giphy.com/v1/gifs/search", {
        params: {
          api_key: "1Z21ZgRnBV0EHO9ZLEtGy0IyVIoP1A0y",
          q: search,
          limit: 100,
        },
      });
      setData(results.data.data);
    } catch (err) {
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }

    setIsLoading(false);
  };

  const pageSelected = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="m-2">
      {renderError()}
      <form className="form-inline justify-content-center m-2">
        <input
          value={search}
          onChange={handleSearchChange}
          type="text"
          placeholder="search"
          className="form-control"
        />
        <button
          onClick={handleSubmit}
          type="submit"
          className="btn btn-primary mx-2"
        >
          Go
        </button>
      </form>
      <Paginate
        pageSelected={pageSelected}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
      />
      <div className="container gifs">{renderGifs()}</div>
    </div>
  );
};

export default Giphy;
