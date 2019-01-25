<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:mathml="http://www.w3.org/1998/Math/MathML"
	xmlns:cellml10="http://www.cellml.org/cellml/1.0#"
	xmlns:cellml11="http://www.cellml.org/cellml/1.1#"
	xmlns:cmeta="http://www.cellml.org/metadata/1.0#"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:cellml="http://www.cellml.org/cellml/2.0#"
	exclude-result-prefixes="cmeta cellml10 cellml11 mathml">

	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="no"/>

	<!-- Any elements or attributes not specified below will be dropped -->
	<xsl:template match="* | @*" priority="-1.0">
	</xsl:template>

	<!-- MathML gets copied over as-is -->
	<xsl:template match="mathml:*">
		<xsl:copy copy-namespaces="no">
			<xsl:apply-templates select="@* | node()"/>
		</xsl:copy>
	</xsl:template>

	<!-- By default attributes on MathML elements are also copied.
		Note that the priority attribute ensures the subsequent template takes priority over this one. -->
	<xsl:template match="mathml:*/@*" priority="-0.5">
		<xsl:copy-of select="."/>
	</xsl:template>

	<!-- Except for cellml:units attributes, which need to change namespace -->
	<xsl:template match="@cellml10:units | @cellml11:units">
		<xsl:attribute name="units" namespace="http://www.cellml.org/cellml/2.0#">
			<xsl:value-of select="."/>
		</xsl:attribute>
	</xsl:template>

	<!-- CellML elements get changed to the latest namespace but otherwise left the same by default.
		Alternative handling for specific elements is given below. -->
	<xsl:template match="cellml10:* | cellml11:*">
		<xsl:element name="{local-name()}" namespace="http://www.cellml.org/cellml/2.0#">
			<!-- Explicit copy of unprefixed attributes that can appear in CellML elements -->
			<xsl:copy-of select="
					@name | @units | @initial_value |
					@prefix | @exponent | @multiplier |
					@units_ref | @component_ref | @component |
					@component_1 | @component_2 | @variable_1 | @variable_2"/>
			<xsl:apply-templates select="@* | node()"/>
		</xsl:element>
	</xsl:template>

	<!-- We treat the root element specially so the cellml prefix gets declared globally in the result document -->
	<xsl:template match="cellml10:model | cellml11:model">
		<model xmlns="http://www.cellml.org/cellml/2.0#" xmlns:cellml="http://www.cellml.org/cellml/2.0#">
			<xsl:copy-of select="@name"/>
			<xsl:apply-templates select="@* | node()"/>
		</model>
	</xsl:template>

	<!-- Variable elements need special handling for their interface attributes -->
	<xsl:template match="cellml10:variable | cellml11:variable">
		<xsl:element name="variable" namespace="http://www.cellml.org/cellml/2.0#">
			<xsl:apply-templates select="@cmeta:id"/>
			<xsl:copy-of select="@name | @initial_value | @units"/>
			<xsl:variable name="has_public_if" select="@public_interface and @public_interface != 'none'"/>
			<xsl:variable name="has_private_if" select="@private_interface and @private_interface != 'none'"/>
			<xsl:choose>
				<xsl:when test="$has_public_if and $has_private_if">
					<xsl:attribute name="interface">public_and_private</xsl:attribute>
				</xsl:when>
				<xsl:when test="$has_public_if">
					<xsl:attribute name="interface">public</xsl:attribute>
				</xsl:when>
				<xsl:when test="$has_private_if">
					<xsl:attribute name="interface">private</xsl:attribute>
				</xsl:when>
			</xsl:choose>
		</xsl:element>
	</xsl:template>

	<!-- Only the encapsulation relationship exists for CellML 2.0 -->
	<xsl:template match="cellml10:group | cellml11:group">
		<xsl:if test="cellml10:relationship_ref[@relationship = 'encapsulation'] | cellml11:relationship_ref[@relationship = 'encapsulation']">
			<xsl:element name="encapsulation" namespace="http://www.cellml.org/cellml/2.0#">
				<xsl:apply-templates select="@cmeta:id"/>
				<xsl:apply-templates select="cellml10:component_ref | cellml11:component_ref | text()"/>
			</xsl:element>
		</xsl:if>
	</xsl:template>

	<!-- The reaction element has been removed -->
	<xsl:template match="cellml10:reaction | cellml11:reaction">
	</xsl:template>

	<!-- The connection element should be copied -->
	<xsl:template match="cellml10:connection | cellml11:connection">
		<xsl:element name="connection" namespace="http://www.cellml.org/cellml/2.0#">
			<xsl:copy-of select="@*|cellml10:map_components/@*" />
			<xsl:copy-of select="@*|cellml11:map_components/@*" />
			<xsl:apply-templates />
		</xsl:element>
	</xsl:template>

	<!-- The map_components element should be ignored -->
	<xsl:template match="cellml10:map_components | cellml11:map_components">
	</xsl:template>

	<!-- The cmeta:id attribute becomes an unprefixed attribute on CellML elements -->
	<xsl:template match="cellml10:*/@cmeta:id | cellml11:*/@cmeta:id">
		<xsl:attribute name="id">
			<xsl:value-of select="."/>
		</xsl:attribute>
	</xsl:template>

	<!-- The xlink:href attribute gets copied -->
	<xsl:template match="@xlink:href">
		<xsl:copy-of select="."/>
	</xsl:template>

	<!-- Comments & text should be copied -->
	<xsl:template match="comment() | text()">
		<xsl:copy/>
	</xsl:template>

</xsl:stylesheet>

