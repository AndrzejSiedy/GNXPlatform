using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Neo4jClient;
using Neo4jClient.Cypher;

namespace Portal.Models
{

    public class Base
    {
        public string Id { get; set; }

    }
    public class Neo4jUser: Base
    {
        public string UserName { get; set; }
    }

    public class Neo4jModule: Base
    {
        public string Name { get; set; }
        public string GadgetUrl { get; set; }
        public string Thumbnail { get; set; }
        public string Desciption { get; set; }
        public bool IsPublic { get; set; }
        public string OwnerId { get; set; }
        public string ImgUrl { get; set; }

    }

}