const HOST_PORT = 8080
const HOST_URL = "http://localhost:" + HOST_PORT


// Order Service URLs
const ORDER_SERVICE_URL = `${HOST_URL}/order`;
const ORDER_SERVICE_URL_ALL_ORDERS = ORDER_SERVICE_URL + "/all";
const ORDER_SERVICE_URL_TOTAL_PAGES = ORDER_SERVICE_URL + "/pagination/totalPage";

const ORDER_SERVICE_URL_ORDERS_PAGE =
    function (pageNumber, size, columnName = "id") 
    {
        return ORDER_SERVICE_URL
            + `/pagination/pageNumber/${pageNumber}`
            + `/size/${size}`
            + `/sort/${columnName}`;
    };