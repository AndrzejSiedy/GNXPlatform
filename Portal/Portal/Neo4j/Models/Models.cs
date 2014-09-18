using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Neo4jClient;
using Neo4jClient.Cypher;

namespace Portal.Models
{

    public class Neo4jBase
    {
        public string Id { get; set; }

    }
    public class Neo4jUser: Neo4jBase
    {
        public string UserName { get; set; }
    }

    public class Neo4jModule: Neo4jBase
    {
        public string Name { get; set; }
        public string GadgetUrl { get; set; }
        public string Thumbnail { get; set; }
        public string Description { get; set; }
        public bool IsPublic { get; set; }
        public string OwnerId { get; set; }
        public string ImgUrl { get; set; }

    }

}