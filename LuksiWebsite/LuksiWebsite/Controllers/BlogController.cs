using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LuksiWebsite.Controllers
{
    public class BlogController : ApiController
    {
        public object Get()
        {
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create("http://api.tumblr.com/v2/blog/luksigame.tumblr.com/posts/text?api_key=7NCUS2QkIQsiaQwDvBffbuJ2HcEoJdT9i5tv8qDdU6DUoLWIIB");
            request.Method = "GET";
            String result = String.Empty;
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                Stream dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                result = reader.ReadToEnd();
                reader.Close();
                dataStream.Close();
            }

            var parsedObject = JObject.Parse(result);

            return parsedObject;
        }
    }
}
