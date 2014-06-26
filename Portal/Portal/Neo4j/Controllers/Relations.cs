using Neo4jClient;
using Portal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Neo4j.Relations
{

    public class OwnsModule : Relationship, IRelationshipAllowingSourceNode<Neo4jUser>, IRelationshipAllowingTargetNode<Neo4jModule>
    {
        public OwnsModule(NodeReference targetNode)
            : base(targetNode)
        {
        }

        public const string TypeKey = "OWNS_MODULE";
        public override string RelationshipTypeKey
        {
            get { return TypeKey; }
        }
    }

}