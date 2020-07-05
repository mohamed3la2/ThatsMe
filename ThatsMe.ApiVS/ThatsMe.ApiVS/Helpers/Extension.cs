using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ThatsMe.ApiVS.Helpers
{
    public static class Extension
    {
        public static void AddHeaderstoApplicationError(this HttpResponse response , string msg)
        {
            response.Headers.Add("Application-Error", msg);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static void AddPaginationHeaders(this HttpResponse response, int pageNumber, int itemsPerPage, int totalItems , int totalPages)
        {
            var PaginationHeader  = new PaginationHeader(pageNumber , itemsPerPage ,totalItems , totalPages);
            var camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(PaginationHeader, camelCaseFormatter));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");

        }

        public static int CalculateAge(this DateTime hisDate)
        {
            var age = DateTime.Today.Year - hisDate.Year;
            if (hisDate.AddYears(age) > DateTime.Today)
                age--;
            return age; 
        }
    }
}
