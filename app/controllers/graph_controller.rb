class GraphController < AdminController
  def index
    @require = require_statement
    @demand = demand_statement
    #logger.debug JSON.pretty_generate(@condition_obj)
    
    @nodes = {}
    @links = [
      {:source=>"Gilad", :target=> "Gilad", :type=> "licensing"},
      {:source=>"Microsoft", :target=> "HTC", :type=> "licensing"},
      {:source=>"Samsung", :target=> "Apple", :type=> "suit"},
      {:source=>"Motorola", :target=> "Apple", :type=> "suit"},
      {:source=>"Nokia", :target=> "Apple", :type=> "resolved"},
      {:source=>"HTC", :target=> "Apple", :type=> "suit"},
      {:source=>"Kodak", :target=> "Apple", :type=> "suit"},
      {:source=>"Kodak", :target=> "Kodak", :type=> "resolved"},
      {:source=>"Kodak", :target=> "Kodak", :type=> "suit"},
      {:source=>"Microsoft", :target=> "Barnes & Noble", :type=> "suit"}
    ]
    
    
  end
  
  def list_entry_points
  end

  def get_node
  end

  def get_edge
  end

  def set_node
  end

  def set_edge
  end

  
  
  
  private # private # private # private # private # private # private # private # private # 
  
  
  #TODO: make these structures dynamicly generated out of a plugin list
  
  def require_statement
    operands = {"is"=>[],"not"=>[], "grater then"=>[],"lesser then"=>[]}
    scales = {}
    @account.scales.each{|s| scales[s.code]=operands}
    badges =  @account.badges.map{|b| b.name} #terminating Array
    value_type = {"with Value"=>operands, "with Scale"=>scales}
    { 
      "if User Event"=>value_type,
      "if User Scale"=>scales,
      "if User has Badge"=>badges,
      "unless User has Badge"=>badges
    }
  end
  
  def demand_statement
    operands = {"by (factor)"=>[],"by event value and factored by"=>[], "with event value factored by"=>[]}
    scales = {}
    @account.scales.each{|s| scales[s.code]=operands}
    badges =  @account.badges.map{|b| b.name} #terminating Array
    value_type = {"with Value"=>operands, "with Scale"=>scales}
    
    { 
      "upset User Scale"=>scales,
      "grant User with Badge"=>badges,
      "revoke User of Badge"=>badges,
      "send Notification"=>[]
    }
  end
  
  
  

end
