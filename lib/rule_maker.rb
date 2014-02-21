class RuleMaker

  OPERANDS = {"is"=>"==","not"=>"!=", "grater then"=>">","lesser then"=>"<"}
  REGEXP = {"starts with"=>".start_with?","end_with"=>".end_with?", "contains"=>".include?","equals"=>"==","expression"=>".match"}

  TREE = {
    "if User Event"=>{
      "with Value"=>["(last_event.value ",OPERANDS, :last],
      "with Code"=>["(last_event.code",REGEXP,"('",:last,"'))"]
    },
    "if User Scale"=>["(user.score(account.scales.find_by_code('",:next,"')) ",OPERANDS,:last,")"],
    "if User Has Badge"=>["(user.has_badge_named?('",:last,"'))"],
    "unless User has Badge"=>["(!user.has_badge_named?('",:last,"'))"],
    "if User is Flagged with"=>[],
    "unless User is Flagged with"=>[],

  }
  
  def self.code(line,tree=TREE)
    cmd = line.shift
    #p tree
    unless tree[cmd].kind_of?(Array)
      code(line,tree[cmd])  
    else
      plot line, tree[cmd]
    end
  end
  
  def self.plot(line,code)
    code.map{|cmd| 
      if cmd.kind_of?(String)
        cmd
      elsif cmd.kind_of?(Hash)
        cmd[line.shift]
      elsif cmd.kind_of?(Symbol)
        if cmd==:next
          line.shift
        elsif cmd==:last
          line.last
        end
      end
      }
  end

end

