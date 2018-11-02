with open("test02.jff", "w") as file:
    file.write("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!--Created with JFLAP 6.4.--><structure>\n")
    file.write("    <type>fa</type>\n")
    file.write("    <automaton>\n")
    counter = 0
    while (counter < 65):
        file.write("<state id=\"" counter "\" name=\"q" counter "\">")
        file.write("<x>")

        '''<state id="0" name="q0">
			<x>1038.0</x>
			<y>918.0</y>
			<label>LLLLL</label>
			<initial/>
		</state>'''
