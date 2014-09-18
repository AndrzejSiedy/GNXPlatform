using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Portal.Models;
using Portal.Controllers;
using Neo4jClient;
using Neo4jClient.Cypher;
using System.Runtime.InteropServices;

namespace Portal.Neo4j.Controllers
{
    public class Operations
    {

        public static void CreateUser(Neo4jUser neo4jUser)
        {


            //Neo4jConfig.client.Cypher
            //    .Create("(Neo4jUser:Neo4jUser {xxx})")
            //    .WithParam("xxx", neo4jUser)
            //    .ExecuteWithoutResults();


            //var newUser = new User { Id = 456, Name = "Jim" };
            //Neo4jConfig.client.Cypher
            //    .Create("(user:User {newUser})")
            //    .WithParam("newUser", newUser)
            //    .ExecuteWithoutResults();


            //NodeReference n = Neo4jConfig.client.Create(neo4jUser,
            //            new IRelationshipAllowingParticipantNode<Neo4jUser>[0],
            //            new[]
            //        {
            //            new IndexEntry("Neo4jUser")
            //            {
            //                { "Id", neo4jUser.Id },
            //                { "UserName", neo4jUser.UserName }
            //            }
            //        });

            var n = Neo4jConfig.client.Cypher
                .Create("(n:Neo4jUser {user})")
                .WithParam("user", neo4jUser)
                .Return<Node<Neo4jUser>>("n")
                .Results;
        }


        //public static Node<T> Create<T>(T obj)
        //{

        //    string cypher = "(n:" + typeof(T).Name +" {anything})";
        //    return Neo4jConfig.client.Cypher
        //        .Create(cypher)
        //        .WithParam("anything", obj)
        //        .Return<Node<T>>("n")
        //        .Results
        //        .Single();

        //}
        public static NodeReference<T> Create<T>(T obj)
        {

            var x = Neo4jConfig.client.Cypher
            .Create("(p:" + typeof(T).Name + " {param})")
            .WithParam("param", obj)
            .Return<Node<T>>("p")
            .Results
            .Single();

            return new NodeReference<T>(x.Reference.Id);
        }


        public static void Update<T>(T obj) where T : Neo4jBase
        {
            // based on http://geekswithblogs.net/codesailor/archive/2014/01/05/155074.aspx
            var inputString = string.Format("({0}:{1})", "record", typeof(T).Name);     
            Neo4jConfig.client.Cypher
				.Match(inputString)
                .Where((T record) => record.Id == obj.Id)                     
				.Set("record = {updatedRecord}")
                .WithParam("updatedRecord", obj)                     
				.ExecuteWithoutResults();        

        }

        public static void Delete<T>(string id) where T : Neo4jBase
        {
            // based on http://geekswithblogs.net/codesailor/archive/2014/01/05/155074.aspx

            // include any connected relationships
            var inputString = string.Format("({0}:{1})", "record", typeof(T).Name) + "-[r]-()";
            Neo4jConfig.client.Cypher
                .Match(inputString)
                .Where((T record) => record.Id == id)
                .Delete("record,r")
                .ExecuteWithoutResults();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T1">startNode type</typeparam>
        /// <typeparam name="T2">output type</typeparam>
        /// <param name="startNode"></param>
        /// <param name="relationshipTypeKey"></param>
        /// <returns></returns>
        public static IEnumerable<T2> GetRelatedNodes<T1, T2>(T1 startNode, string relationshipTypeKey)
            where T1 : NodeReference
        {

            // Cypher
            // start n=node(startNode.Id) match p=(a)-[r:relationshipTypeKey]-(b) return p
            return Neo4jConfig.client.Cypher
                .Start("n", startNode)
                .Match("p = (a)-[r:" + relationshipTypeKey + "]->(b)")
                .Where("a.Id = n.Id") // skip starting node in results
                .Return(b => b.As<T2>())
                .Results
                .Distinct(); // we add distinct to remove nodes that duplicates
            // above query would return part as series startNode->endNode
            // where in each loop endNode == startNode in next itteration


        }

        //public static void Delete<T>(string id)
        //{

        //    if (string.IsNullOrEmpty(id)) id = "Id";

        //    var match = "(whatEver:" + typeof(T).Name + ")";
        //    var where = "whatEver.Id = {anything}";

        //    var shouldBeOneOnly = Neo4jConfig.client.Cypher
        //    .Match(match)
        //    .Where(where)
        //    .WithParam("anything", id)
        //    .Return<Node<T>>("whatEver")
        //    .Results.ToList();
        //    if (shouldBeOneOnly.Count == 1)
        //    {
        //        Neo4jConfig.client.Delete(shouldBeOneOnly[0].Reference, DeleteMode.NodeAndRelationships);
        //    }

        //}




        //public static void DeleteUser(string neo4jUserId)
        //{


        //    var wtf = Neo4jConfig.client.Cypher
        //    .Match("(user:User)")
        //    .Where((User user) => user.Id == 456)
        //    .Return(user => user.As<User>())
        //    .Results;


        //    var nU = Neo4jConfig.client.Cypher
        //    .Match("user:Neo4jUser)")
        //    .Where((Neo4jUser user) => user.Id == neo4jUserId)
        //    .Return(user => user.As<Neo4jUser>())
        //    .Results;
        //    //.Results.ToList();
        //            //.Results



        //    var indexQuery = Neo4jConfig.client.Cypher
        //    .Start(new { n = Node.ByIndexLookup("Neo4jUser", "Id", neo4jUserId) })
        //    .Return<Node<Neo4jUser>>("n");
        //    var nodes = indexQuery.Results.ToList();

        //    nodes.ForEach(delegate(Node<Neo4jUser> n)
        //    {
        //        Neo4jConfig.client.Delete(n.Reference, DeleteMode.NodeAndRelationships);
        //    });


        //}

        public static List<T> GetNodes<T>() where T : new()
        {
            Type xx = typeof (T);

            string typeName = xx.Name;

            var x = Neo4jConfig.client
            .Cypher
            .Start(new { n = All.Nodes })
            .Return<T>("n");

            var nodes = x.Results.ToList();


            var y = Neo4jConfig.client.Cypher
                .Match("(user:Neo4jUser)")
                .Return(user => user.As<T>())
                .Results.ToList();


            return nodes; // new T();
        }

        public static void CreateModule(Neo4jModule module)
        {

            Neo4jConfig.client.Cypher
                .Create("(neo4jModule:Neo4jModule {newModule})")
                .WithParam("newModule", module)
                .ExecuteWithoutResults();

        }


        public static void DeleteModule(string moduleId)
        {

            var indexQuery = Neo4jConfig.client.Cypher
            .Start(new { n = Node.ByIndexLookup("Neo4jModule", "Id", moduleId) })
            .Return<Node<Neo4jModule>>("n");
            var nodes = indexQuery.Results.ToList();

            nodes.ForEach(delegate(Node<Neo4jModule> n)
            {
                Neo4jConfig.client.Delete(n.Reference, DeleteMode.NodeAndRelationships);
            });
        }

        public static IEnumerable<T> Get<T>(object paramValue, [Optional] string paramName)
        {
            //var u = graphClient.Cypher
            //.Match("(user:User)")
            //.Where((User user) => user.Id == 456)
            //.Return(user => user.As<User>());

            if (string.IsNullOrEmpty(paramName)) paramName = "Id";

            var match = "(whatEver:" + typeof(T).Name + ")";
            var where = "whatEver." + paramName + " = {anything}";

            return Neo4jConfig.client.Cypher
            .Match(match)
            .Where(where)
            .WithParam("anything", paramValue)
            .Return(whatEver => whatEver.As<T>())
            .Results;
        }

        public static Node<T> GetAsNode<T>(object paramValue, [Optional] string paramName)
        {
            //var u = graphClient.Cypher
            //.Match("(user:User)")
            //.Where((User user) => user.Id == 456)
            //.Return(user => user.As<User>());

            if (string.IsNullOrEmpty(paramName)) paramName = "Id";

            var match = "(whatEver:" + typeof(T).Name + ")";
            var where = "whatEver." + paramName + " = {anything}";

            return Neo4jConfig.client.Cypher
            .Match(match)
            .Where(where)
            .WithParam("anything", paramValue)
            .Return<Node<T>>("whatEver")
            .Results
            .Single();
        }

        public static NodeReference<T> GetAsNodeReference<T>(object paramValue, [Optional] string paramName)
        {
            //var u = graphClient.Cypher
            //.Match("(user:User)")
            //.Where((User user) => user.Id == 456)
            //.Return(user => user.As<User>());

            if (string.IsNullOrEmpty(paramName)) paramName = "Id";

            var match = "(n:" + typeof(T).Name + ")";
            var where = "n." + paramName + " = {anything}";

            return Neo4jConfig.client.Cypher
            .Match(match)
            .Where(where)
            .WithParam("anything", paramValue)
            .Return<NodeReference<T>>("n")
            .Results
            .Single();
        }

        public static void SetRelation<T1, T2>(T1 sourceNode, T2 targetNode, string relName, dynamic relData)
            where T1 : Neo4jBase
            where T2 : Neo4jBase
        {

            var matchSourceNode = "(sourceNode:" + typeof(T1).Name + ")";
            var matchTargetNode = "(targetNode:" + typeof(T2).Name + ")";

            var whereSourceNode = "sourceNode.Id = {sourceNodeId}";
            var whereTargetNode = "targetNode.Id = {targetNodeId}";

            var relation = "sourceNode<-[:" + relName + " {relationship}]-targetNode";

            Neo4jConfig.client.Cypher
                //.Match("(user1:User)", "(user2:User)")
            .Match(matchSourceNode, matchTargetNode)
            .Where(whereSourceNode)
            .AndWhere(whereTargetNode)
            .WithParam("sourceNodeId", sourceNode.Id)
            .WithParam("targetNodeId", targetNode.Id)
            .WithParam("sourceNode", sourceNode)
            .WithParam("targetNode", targetNode)
            .WithParam("relationship", relData)
            .Create(relation)
            .ExecuteWithoutResults();


            //var tNode = GetAsNode<T2>(targetNode);

            //var tList = tNode.ToList();
            //// create relationship
            //if (tList.Count > 0)
            //{
            //    var relationShip = new ModuleBelongsTo(tList[0].Reference);
            //    graphClient.CreateRelationship<NodeReference, Relationship>(tList[0].Reference as NodeReference, relationShip);
            //}


        }


        public void Rubish(Neo4jModule module)
        {
            //var dupa = Neo4jConfig.client.Cypher
            //.Match("(user:User)")
            //.Return(user => user.As<User>())
            //.Results.ToList();


            //var dupa1 = Neo4jConfig.client.Cypher
            //.Match("(user:User)")
            //.Where((User user) => user.Id == 1234)
            //.Return(user => user.As<User>())
            //.Results.ToList();


            //var dupa3 = Neo4jConfig.client.Cypher
            //.OptionalMatch("(user:User)-[FRIENDS_WITH]-(friend:User)")
            //.Where((User user) => user.Id == 1234)
            //.Return((user, friend) => new
            //{
            //    User = user.As<User>(),
            //    Friends = friend.CollectAs<User>()
            //})
            //.Results.ToList();


            //var newUser = new User { Id = 456, Name = "Jim" };
            //Neo4jConfig.client.Cypher
            //    .Create("(user:User {newUser})")
            //    .WithParam("newUser", newUser)
            //    .ExecuteWithoutResults();





            //var x1 = GetNodes<Neo4jModule>();

            //var x2 = GetNodes<Neo4jUser>();


            Neo4jConfig.client.Cypher
                .Create("(neo4jModule:Neo4jModule {newModule})")
                .WithParam("newModule", module)
                .ExecuteWithoutResults();

            // get user node - will be used to create relation
            var indexQuery = Neo4jConfig.client.Cypher
            .Start(new { node = Node.ByIndexLookup("Neo4jUser", "Id", module.OwnerId) })
            .Return<Node<Neo4jUser>>("node");
            var nodes = indexQuery.Results.ToList();

            //// yet another example of query for node of user type
            //List<Neo4jUser> x = Neo4jConfig.client.Cypher
            //    .Match("(user:User)")
            //    .Where((Neo4jUser user) => user.Id == module.OwnerId)
            //    .Return(user => user.As<Neo4jUser>())
            //    .Results.ToList();


            // There sould be only one node with given user id
            // NOTE: userNode has Reference property if type ReferenceNode
            var userNode = nodes[0];




            //// create relation between user(owner) -> module
            //var r1 = new OwnedBy(userNode.Reference, RelationshipDirection.Automatic);
            //// create module node with reference to the owner user
            //Neo4jConfig.client.Create(module, r1);





            //// Exampel of creating module first
            //NodeReference n = Neo4jConfig.client.Create(module,
            //            new IRelationshipAllowingParticipantNode<Neo4jModule>[0],
            //            new[]
            //        {
            //            new IndexEntry("Module")
            //            {
            //                { "Id", module.Id },
            //                { "Name", module.Name },
            //                { "Description", module.Description },
            //                { "IsPublic", module.IsPublic },
            //                { "OwnerId", module.OwnerId }
            //            }
            //        });
            // define reference from user to module
            //var r = new Owns(n, RelationshipDirection.Outgoing);

            // Create relation ship only
            //Neo4jConfig.client.CreateRelationship(userNode.Reference, r);
        }

    }

}