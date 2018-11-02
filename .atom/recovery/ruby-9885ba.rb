class Proj2
	def initialize(x1, x2, x3, x4, x5)
		@x1 = x1
		@x2 = x2
		@x3 = x3
		@x4 = x4
		@x5 = x5
	end

end

def main
	machine = Proj2.new("L","L","L","L","L")
	puts "#{machine.x1} #{machine.x2} #{machine.x3} #{machine.x4} #{machine.x5}"
end
