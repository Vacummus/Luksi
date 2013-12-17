using MailChimp;
using MailChimp.Types;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LuksiWebsite.Controllers
{
    public class SubscribeController : ApiController
    {
        public void Post(HttpRequestMessage request)
        {
            var parsedObject = JObject.Parse(request.Content.ReadAsStringAsync().Result);
            var email = (string)parsedObject["email"];

            var apiKey = "9402467576102cf18221cfbf11e37fb4-us7";
            var listId = "6f7d7959f7";
            var options = new List.SubscribeOptions { DoubleOptIn = false, EmailType = List.EmailType.Html, SendWelcome = false };
            var merges = new List<List.Merges> { new List.Merges(email, List.EmailType.Html) };
            var mcApi = new MCApi(apiKey, true);

            var response = mcApi.ListBatchSubscribe(listId, merges, options);

            if (response.ErrorCount > 0)
            {
                throw new HttpResponseException(new HttpResponseMessage((HttpStatusCode)response.Errors[0].Code)
                {
                    Content = new StringContent(response.Errors[0].Message)
                });
            }
        }
    }
}