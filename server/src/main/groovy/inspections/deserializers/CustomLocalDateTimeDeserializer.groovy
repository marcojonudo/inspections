package inspections.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import groovy.transform.CompileStatic
import inspections.utils.Constants

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@CompileStatic
class CustomLocalDateTimeDeserializer extends StdDeserializer<LocalDateTime> {

	CustomLocalDateTimeDeserializer() {
		this(null)
	}

    CustomLocalDateTimeDeserializer(Class<LocalDateTime> clazz) {
		super(clazz)
	}

	@Override
	LocalDateTime deserialize(JsonParser parser, DeserializationContext deserializationContext)
			throws IOException, JsonProcessingException {
		JsonNode node = (JsonNode) parser.getCodec().readTree(parser)
		return LocalDateTime.parse(
			node.asText(), DateTimeFormatter.ofPattern(Constants.DateTimeFormat.yyyy_MM_dd_T_hh_MM_ss_Z)
		)
	}

}
