package inspections.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.databind.node.ArrayNode
import groovy.transform.CompileStatic
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItemData
import inspections.pogos.logs.Jackson

@CompileStatic
class SavedItemDataDeserializer extends StdDeserializer<Set<SavedItemData>> {

	SavedItemDataDeserializer() {
		this(null)
	}

    SavedItemDataDeserializer(Class<SavedItemData> clazz) {
		super(clazz)
	}

	@Override
	Set<SavedItemData> deserialize(JsonParser parser, DeserializationContext deserializationContext)
			throws IOException, JsonProcessingException {
		ArrayNode node = (ArrayNode) parser.getCodec().readTree(parser)
		return node.collect {
			Item.Type type = Item.Type.valueOf(it.get("itemType").asText())
			return (SavedItemData) Jackson.convertValue(it, type.savedItemDataClazz)
		}.toSet()
	}

}
