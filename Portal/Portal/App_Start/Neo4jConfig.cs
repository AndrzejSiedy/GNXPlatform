using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Neo4jClient;
using System.Net;
using System.Diagnostics;

namespace Portal
{
    public class Neo4jConfig
    {
        public static GraphClient client;
        public static bool connected = false;
        public static void Register(string uri)
        {

            try
            {
                client = new GraphClient(new Uri(uri));
                client.Connect();

                // mark service as connected
                connected = true;

                SetIndexes();
            }
            catch (Exception ex)
            {
                // silent fall
            }
            
   
        }


        private static void SetIndexes()
        {
            // create index for users if not exists
            if (!client.CheckIndexExists("User", IndexFor.Node))
                client.CreateIndex("User", new IndexConfiguration { Provider = IndexProvider.lucene, Type = IndexType.exact }, IndexFor.Node);

            if (!client.CheckIndexExists("Neo4jModule", IndexFor.Node))
                client.CreateIndex("Neo4jModule", new IndexConfiguration { Provider = IndexProvider.lucene, Type = IndexType.exact }, IndexFor.Node);

            if (!client.CheckIndexExists("Neo4jUser", IndexFor.Node))
                client.CreateIndex("Neo4jUser", new IndexConfiguration { Provider = IndexProvider.lucene, Type = IndexType.exact }, IndexFor.Node);

        }

        public static IEnumerable<IndexEntry> GetIndexEntries(dynamic user)
        {
            var indexEntries = new List<IndexEntry>
            {
                new IndexEntry
                {
                    Name = "User",
                    KeyValues = new List<KeyValuePair<string, object>>
                    {
                        new KeyValuePair<string, object>("Id", user.Id),
                        new KeyValuePair<string, object>("UserName", user.UserName)
                    }
                }
            };

            return indexEntries;
        }

        //private static bool ServiceExists(
        //string url,
        //bool throwExceptions,
        //out string errorMessage)
        //{
        //    try
        //    {
        //        errorMessage = string.Empty;

        //        // try accessing the web service directly via it's URL
        //        HttpWebRequest request =
        //            WebRequest.Create(url) as HttpWebRequest;
        //        request.Timeout = 30000;

        //        using (HttpWebResponse response =
        //                   request.GetResponse() as HttpWebResponse)
        //        {
        //            if (response.StatusCode != HttpStatusCode.OK)
        //                throw new Exception("Error locating web service");
        //        }

        //        // try getting the WSDL?
        //        // asmx lets you put "?wsdl" to make sure the URL is a web service
        //        // could parse and validate WSDL here

        //    }
        //    catch (WebException ex)
        //    {
        //        // decompose 400- codes here if you like
        //        errorMessage =
        //            string.Format("Error testing connection to web service at" +
        //                          " \"{0}\":\r\n{1}", url, ex);
        //        Trace.TraceError(errorMessage);
        //        if (throwExceptions)
        //            throw new Exception(errorMessage, ex);
        //    }
        //    catch (Exception ex)
        //    {
        //        errorMessage =
        //            string.Format("Error testing connection to web service at " +
        //                          "\"{0}\":\r\n{1}", url, ex);
        //        Trace.TraceError(errorMessage);
        //        if (throwExceptions)
        //            throw new Exception(errorMessage, ex);
        //        return false;
        //    }

        //    return true;
        //}
    }
}