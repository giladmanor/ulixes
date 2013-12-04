class GraphController < AdminController
  def index
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
  end
  
  def list_rewards
  end
  
  def list_scales
  end
  
  def list_operators
  end
  
  
  
  
  
  
  
  
  

end
