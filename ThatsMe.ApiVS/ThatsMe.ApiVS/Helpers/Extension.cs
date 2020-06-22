using Microsoft.AspNetCore.Http;
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
        public static int CalculateAge(this DateTime hisDate)
        {
            var age = DateTime.Today.Year - hisDate.Year;
            if (hisDate.AddYears(age) > DateTime.Today)
                age--;
            return age; 
        }
    }
}
