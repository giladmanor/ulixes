class VisualAidController < AdminController
  def index

  end

  def show
    render params[:id]
  end

  def get_node_trace
    node = @account.nodes.find(params[:id])
    render :json=>{:name=>node.name,:size=>node.users.size,:actions=>node.user_events.map{|k,v| {:name=>k,:value=>v}}}
  end

  def get_node_dependancy
    node_names = @account.nodes.map{|n| n.name}
    node_ids = @account.nodes.map{|n| n.id}

    transitions = @account.users.map{|u| u.flags.where(:code=>"_TRANSITION").map{|e| e.value.to_i}}.flatten

    dependencies =node_ids.map{|nid| node_ids.map{|nidd| 0}}
    transitions.map{|eid|
      edge = @account.edges.find(eid)
      dependencies[node_ids.index(edge.target_id)][node_ids.index(edge.source_id)] +=1
    }
    logger.debug dependencies.inspect

    render :json=>{:nodes=>node_names, :dependencies=>dependencies}
  end

  def get_node_clusters
    vectors = @account.users.map{|u| u.vector}
    
    
    render :json=>{:name=>"root",:size=>@account.users.size, :children=>@account.nodes.map{|n| {:name=>n.name, :size=>n.users.size, :children=>n.users.map{|u| {:name=>u.uid, :size=>1,:children=>[]}}}}}
  end
  
  def distance(v1,v2)
    v=v1.merge(v2){|k,vv1,vv2| ((vv1||0)+(vv2||0))^2}
    sum = 0
    v.values{|vv| sum+=vv}
    Math.sqrt(sum)
  end

  def get_node_funnels
    node_names = @account.nodes.map{|n| {:name=>n.name}}
    node_ids = @account.nodes.map{|n| n.id}

    transitions = @account.users.map{|u| u.flags.where(:code=>"_TRANSITION").map{|e| e.value.to_i}}.flatten

    dependencies ={}
    transitions.map{|eid|
      dependencies[eid] = (dependencies[eid] || 0) + 1
    }
    tmp_nodes = []
    edges = dependencies.map{|k,v|
      edge = @account.edges.find(k)
      unless tmp_nodes.index(edge.target_id)
        tmp_nodes << edge.source_id
        {:value=>v}.merge({:source=>node_ids.index(edge.source_id),:target=>node_ids.index(edge.target_id)})
      else
        nil
      end
    }.compact
    res = {:nodes=>node_names, :edges=>edges}
    logger.debug res.inspect
    render :json=>res
  end

end
