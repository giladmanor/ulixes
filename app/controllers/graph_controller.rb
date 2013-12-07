class GraphController < AdminController
  def index
    @condition_obj = condition_obj
    
    #logger.debug JSON.pretty_generate(@condition_obj)
  end
  
  def condition_obj
    
    operands = {"is"=>[],"not"=>[], "grater then"=>[],"lesser then"=>[]}
    scales = {}
    @account.scales.each{|s| scales[s.code]=operands}
    badges =  @account.badges.map{|b| b.name} #terminating Array
    value_type = {"with Value"=>operands, "with Scale"=>scales}
    { 
      "if User Action"=>value_type,
      "if User Scale"=>scales,
      "if User has Badge"=>badges,
      "unless User has Badge"=>badges
    }
  end
  

  def list_entry_points
  end

  def get_graph_data
    p = params[:entry_point]

    res = [
      {source=> "Microsoft", target=> "Amazon", type=> "licensing"},
      {source=> "Microsoft", target=> "HTC", type=> "licensing"},
      {source=> "Samsung", target=> "Apple", type=> "suit"},
      {source=> "Motorola", target=> "Apple", type=> "suit"},
      {source=> "Nokia", target=> "Apple", type=> "resolved"},
      {source=> "HTC", target=> "Apple", type=> "suit"},
      {source=> "Kodak", target=> "Apple", type=> "suit"},
      {source=> "Kodak", target=> "Kodak", type=> "resolved"},
      {source=> "Kodak", target=> "Kodak", type=> "suit"},
      {source=> "Microsoft", target=> "Barnes & Noble", type=> "suit"}
    ]

    render :json => res
  end

  def get_node
  end

  def get_edge
  end

  def set_node
  end

  def set_edge
  end

  def list_conditions
    res = [
      {
        "name"=> "if User Action",
        "description"=> "Condition by event on a user action",
        "value"=> "if User Action",
        "tokens"=> ["if","user","action"]
      },
      {
        "name"=> "if User Scale",
        "description"=> "Condition by measured user scale",
        "value"=> "if User Scale",
        "tokens"=> ["if","user","scale"]
      },
      {
        "name"=> "if User has badge",
        "description"=> "Case User has a badge",
        "value"=> "if User has badge",
        "tokens"=> ["if","has","action"]
      },
      {
        "name"=> "if User does not have badge",
        "description"=> "Case User has a badge",
        "value"=> "if User does not have badge",
        "tokens"=> ["if","no","badge"]
      }
    ]
    logger.debug res.inspect
    render :json=> res
  end

  def list_rewards
  end

  def list_scales
  end

  def list_operators
  end

end
