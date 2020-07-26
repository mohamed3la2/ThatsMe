using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Hubs
{
    public class MessageHub: Hub
    {
        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            int UserConnectionId = int.Parse(httpContext.Request.Query["UserConnectionId"]);
            string ConnectionId = Context.ConnectionId;

            if (ConnectedUser.UserConnectedList.ContainsKey(UserConnectionId))
            {
                ConnectedUser.UserConnectedList.Remove(UserConnectionId);
            }
            ConnectedUser.UserConnectedList.Add(UserConnectionId, ConnectionId);

            return base.OnConnectedAsync();
        }
    }
    public static class ConnectedUser
    {
        
        //public static List<string> Ids = new List<string>();
        public static Dictionary<int, string> UserConnectedList = new Dictionary<int, string>();

    }
}
