
first where i will save (conversation id ) or is not matter

---

secound tha ai devloper  in
post {{AI_SERVICE_URL}}api/chat
want
in body

```json
{
  "conversation_id": "string",
  "message": "ايه تطعيمات عمر شهرين؟"
}
```

in header 

| Name      | Description |
| --------- | ----------- |
| X-User-ID |  userid     |


---
third  this is documnetation of ai devloper so what else do we need to connect with him

#### [Conversations](https://medchatbot-live-demo-production.up.railway.app/apidocs/#/Conversations)

GET[​/api​/conversations](https://medchatbot-live-demo-production.up.railway.app/apidocs/#/Conversations/get_api_conversations)

List all conversations for the authenticated user.

get_api_conversations

#### Parameters

Try it out

|Name|Description|
|---|---|
|X-User-ID *<br><br>string<br><br>(header)||

#### Responses

Response content type

application/json

|Code|Description|
|---|---|
|200|List of conversations (most recent first)<br><br>- Example Value<br>- Model<br><br>[<br>  {<br>    "conversation_id": "string",<br>    "created_at": "2026-04-26T22:34:15.281Z",<br>    "last_message": "string",<br>    "updated_at": "2026-04-26T22:34:15.281Z"<br>  }<br>]|
|401|Missing X-User-ID header|

DELETE[​/api​/conversations​/{conversation_id}](https://medchatbot-live-demo-production.up.railway.app/apidocs/#/Conversations/delete_api_conversations__conversation_id_)

Delete a conversation (only the owner can delete it).

delete_api_conversations__conversation_id_

#### Parameters

Try it out

|Name|Description|
|---|---|
|X-User-ID *<br><br>string<br><br>(header)||
|conversation_id *<br><br>string<br><br>(path)||

#### Responses

Response content type

application/json

|Code|Description|
|---|---|
|200|Conversation deleted<br><br>- Example Value<br>- Model<br><br>{<br>  "conversation_id": "string",<br>  "status": "deleted"<br>}|
|401|Missing X-User-ID header|
|404|Conversation not found or not owned by this user|

GET[​/api​/conversations​/{conversation_id}](https://medchatbot-live-demo-production.up.railway.app/apidocs/#/Conversations/get_api_conversations__conversation_id_)

Retrieve messages of a specific conversation.

get_api_conversations__conversation_id_

#### [System](https://medchatbot-live-demo-production.up.railway.app/apidocs/#/System)

GET[​/api​/health](https://medchatbot-live-demo-production.up.railway.app/apidocs/#/System/get_api_health)

Health check — probes MongoDB and LM Studio reachability.

get_api_health

#### Parameters

Try it out

No parameters

#### Responses

Response content type

application/json

|Code|Description|
|---|---|
|200|Service status<br><br>- Example Value<br>- Model<br><br>{<br>  "lm_studio_configured": true,<br>  "lm_studio_reachable": true,<br>  "mongodb_connected": true,<br>  "service": "string",<br>  "spd_data": true,<br>  "status": "ok",<br>  "vaccination_data": true<br>}|
